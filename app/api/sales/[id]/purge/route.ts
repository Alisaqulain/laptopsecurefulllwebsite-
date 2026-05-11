import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { SaleModel } from "@/lib/db/models/Sale";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

/** Permanently delete a sale from DB (SUPER_ADMIN only). Requires it to be already soft-deleted. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();
  const sale = await SaleModel.findById(id).lean();
  if (!sale) return fail("Not found", { status: 404, code: "NOT_FOUND" });
  if (!sale.deletedAt) return fail("Only deleted sales can be purged", { status: 400, code: "NOT_DELETED" });

  await SaleModel.deleteOne({ _id: id });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SALE_PURGE",
    entityType: "Sale",
    entityId: id,
    oldValue: { invoiceNumber: sale.invoiceNumber },
  }).catch(() => null);

  return ok({ purged: true });
}

