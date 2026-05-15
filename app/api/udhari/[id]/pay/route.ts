import { z } from "zod";
import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { SaleModel } from "@/lib/db/models/Sale";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const PaySchema = z.object({
  amount: z.number().min(0.01),
  note: z.string().max(300).optional(),
});

/** Record a partial or full udhari payment against a sale. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const parsed = PaySchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const sale = await SaleModel.findOne({ _id: id, deletedAt: null });
  if (!sale) return fail("Sale not found", { status: 404, code: "NOT_FOUND" });

  const finalTotal = sale.totals?.finalTotal ?? 0;
  const balanceDue = sale.udhari?.balanceDue ?? Math.max(0, finalTotal - (sale.udhari?.amountReceived ?? finalTotal));

  if (balanceDue <= 0) return fail("No udhari balance on this sale", { status: 400, code: "NO_BALANCE" });

  const payAmount = parsed.data.amount;
  if (payAmount > balanceDue + 0.001) {
    return fail(`Payment cannot exceed balance due (${balanceDue.toFixed(2)})`, {
      status: 400,
      code: "OVERPAY",
    });
  }

  const newReceived = (sale.udhari?.amountReceived ?? 0) + payAmount;
  const newBalance = Math.max(0, finalTotal - newReceived);

  if (!sale.udhari) {
    sale.udhari = { amountReceived: 0, balanceDue: finalTotal, payments: [] };
  }
  sale.udhari.amountReceived = newReceived;
  sale.udhari.balanceDue = newBalance;
  sale.udhari.payments = sale.udhari.payments ?? [];
  sale.udhari.payments.push({
    amount: payAmount,
    date: new Date(),
    note: parsed.data.note?.trim(),
    recordedByUserId: new Types.ObjectId(auth.session.userId),
  });

  await sale.save();

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "UDHARI_PAYMENT",
    entityType: "Sale",
    entityId: id,
    newValue: { amount: payAmount, balanceDue: newBalance, invoiceNumber: sale.invoiceNumber },
  }).catch(() => null);

  return ok({
    sale: {
      _id: String(sale._id),
      invoiceNumber: sale.invoiceNumber,
      udhari: sale.udhari,
      totals: sale.totals,
    },
  });
}
