import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/Category";
import { ProductModel } from "@/lib/db/models/Product";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { slugify } from "@/lib/inventory/productMatch";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const PatchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  slug: z.string().min(2).max(120).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const existing = await CategoryModel.findById(id).lean();
  if (!existing) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  const u: Record<string, unknown> = {};
  if (parsed.data.name != null) u.name = parsed.data.name.trim();
  if (parsed.data.status != null) u.status = parsed.data.status;

  let newSlug: string | undefined;
  if (parsed.data.slug != null) {
    newSlug = parsed.data.slug.toLowerCase().trim();
  } else if (parsed.data.name != null) {
    newSlug = slugify(parsed.data.name);
  }
  if (newSlug) {
    const clash = await CategoryModel.findOne({ slug: newSlug, _id: { $ne: id } }).lean();
    if (clash) return fail("Slug already in use", { status: 409, code: "DUPLICATE_SLUG" });
    u.slug = newSlug;
  }

  const updated = await CategoryModel.findByIdAndUpdate(id, { $set: u }, { new: true }).lean();
  if (!updated) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "CATEGORY_UPDATE",
    entityType: "Category",
    entityId: id,
    newValue: updated,
  }).catch(() => null);

  return ok({ category: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();
  const used = await ProductModel.exists({ categoryId: id });
  if (used) return fail("Category is used by products. Reassign products first.", { status: 409, code: "IN_USE" });

  const res = await CategoryModel.deleteOne({ _id: id });
  if (res.deletedCount === 0) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "CATEGORY_DELETE",
    entityType: "Category",
    entityId: id,
  }).catch(() => null);

  return ok({ deleted: true });
}
