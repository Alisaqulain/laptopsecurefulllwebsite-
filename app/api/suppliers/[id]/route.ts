import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { SupplierModel } from "@/lib/db/models/Supplier";
import { PurchaseModel } from "@/lib/db/models/Purchase";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const PatchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(40).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  gstNumber: z.string().max(30).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();
  const supplier = await SupplierModel.findById(id).lean();
  if (!supplier) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  const purchases = await PurchaseModel.find({ supplierId: id, deletedAt: null })
    .sort({ date: -1 })
    .limit(50)
    .select({ invoiceNumber: 1, date: 1, totals: 1 })
    .lean();

  return ok({ supplier, purchases });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();
  const u: Record<string, unknown> = {};
  if (parsed.data.name != null) u.name = parsed.data.name.trim();
  if (parsed.data.phone !== undefined) u.phone = parsed.data.phone?.trim() ?? "";
  if (parsed.data.address !== undefined) u.address = parsed.data.address?.trim() ?? "";
  if (parsed.data.gstNumber !== undefined) u.gstNumber = parsed.data.gstNumber?.trim() ?? "";
  if (parsed.data.notes !== undefined) u.notes = parsed.data.notes?.trim() ?? "";
  if (parsed.data.status != null) u.status = parsed.data.status;

  const updated = await SupplierModel.findByIdAndUpdate(id, { $set: u }, { new: true }).lean();
  if (!updated) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SUPPLIER_UPDATE",
    entityType: "Supplier",
    entityId: id,
    newValue: updated,
  }).catch(() => null);

  return ok({ supplier: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();
  const used = await PurchaseModel.exists({ supplierId: id, deletedAt: null });
  if (used) return fail("Supplier has purchase history; deactivate instead of delete.", { status: 409, code: "IN_USE" });

  const res = await SupplierModel.deleteOne({ _id: id });
  if (res.deletedCount === 0) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SUPPLIER_DELETE",
    entityType: "Supplier",
    entityId: id,
  }).catch(() => null);

  return ok({ deleted: true });
}
