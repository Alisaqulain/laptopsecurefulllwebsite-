import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { SaleModel } from "@/lib/db/models/Sale";
import { ProductModel } from "@/lib/db/models/Product";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

/** Restore a soft-deleted sale (SUPER_ADMIN only). */
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();

  const session = await mongoose.startSession();
  let restored: any | null = null;
  try {
    await session.withTransaction(async () => {
      const sale = await SaleModel.findOne({ _id: id, deletedAt: { $ne: null } }).session(session);
      if (!sale) throw new Error("NOT_FOUND");

      // Re-apply stock movement (since delete restored it).
      for (const item of sale.items ?? []) {
        const pid = item.productId as Types.ObjectId;
        const qty = item.quantity ?? 0;
        if (qty <= 0) continue;
        await ProductModel.findByIdAndUpdate(
          pid,
          { $inc: { "stock.onHand": -qty, "stock.sold": qty } },
          { session },
        );
      }

      sale.deletedAt = null as any;
      sale.deletedByUserId = null as any;
      sale.deleteReason = undefined as any;
      await sale.save({ session });
      restored = sale.toObject();
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NOT_FOUND") return fail("Sale not found in deleted log", { status: 404, code: "NOT_FOUND" });
    return fail("Could not restore sale", { status: 500, code: "RESTORE_FAILED" });
  } finally {
    await session.endSession();
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SALE_RESTORE",
    entityType: "Sale",
    entityId: id,
    newValue: restored
      ? { invoiceNumber: restored.invoiceNumber, customer: restored.customerSnapshot?.name ?? "", amount: restored.totals?.finalTotal ?? 0 }
      : undefined,
  }).catch(() => null);

  return ok({ restored: true });
}

