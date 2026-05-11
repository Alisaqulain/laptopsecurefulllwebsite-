import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { SaleModel } from "@/lib/db/models/Sale";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

/**
 * Sales staff cannot delete invoices. They can create a delete request that is visible to Super Admin.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SALES_ADMIN, RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  // Super Admin should just delete via DELETE /api/sales/[id]
  if (auth.session.role === RoleKey.SUPER_ADMIN) {
    return fail("Use delete endpoint", { status: 400, code: "USE_DELETE" });
  }

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const reason = typeof (json as any)?.reason === "string" ? String((json as any).reason).trim().slice(0, 200) : "";

  await connectToDatabase();
  const sale = await SaleModel.findOne({ _id: id, deletedAt: null }).lean();
  if (!sale) return fail("Sale not found", { status: 404, code: "NOT_FOUND" });

  // Only the creator can request deletion (keeps it scoped to their own sales).
  if (String(sale.createdByUserId) !== String(auth.session.userId)) {
    return fail("Forbidden", { status: 403, code: "FORBIDDEN" });
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SALE_DELETE_REQUEST",
    entityType: "Sale",
    entityId: id,
    newValue: { invoiceNumber: sale.invoiceNumber, reason: reason || undefined },
    message: reason ? `Delete requested: ${reason}` : "Delete requested",
  }).catch(() => null);

  return ok({ requested: true });
}

