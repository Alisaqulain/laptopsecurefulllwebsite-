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
import { CATEGORY_FIELD_TYPES } from "@/lib/inventory/categoryFieldTypes";

const FieldDefSchema = z.object({
  id: z.string().min(1).max(80).regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/),
  label: z.string().min(1).max(120),
  type: z.enum(CATEGORY_FIELD_TYPES),
  required: z.boolean().optional(),
  placeholder: z.string().max(200).optional(),
  options: z.array(z.string().max(120)).max(100).optional(),
  order: z.number().int().min(0).max(10_000),
  isMatchKey: z.boolean().optional(),
});

const PatchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(["active", "inactive"]).optional(),
  fieldDefinitions: z.array(FieldDefSchema).max(200).optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
});

function validateFieldDefinitions(defs: z.infer<typeof FieldDefSchema>[] | undefined) {
  if (!defs?.length) return { ok: true as const };
  const ids = new Set<string>();
  for (const f of defs) {
    if (ids.has(f.id)) return { ok: false as const, message: `Duplicate field id: ${f.id}` };
    ids.add(f.id);
  }
  if (!defs.some((f) => f.isMatchKey)) {
    return {
      ok: false as const,
      message: "Mark at least one field as a match key so purchases merge into the correct stock row.",
    };
  }
  for (const f of defs) {
    if ((f.type === "select" || f.type === "dropdown") && f.required && (!f.options || f.options.length === 0)) {
      return { ok: false as const, message: `Field "${f.label}" needs options for select/dropdown.` };
    }
  }
  return { ok: true as const };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();
  const category = await CategoryModel.findById(id).lean();
  if (!category) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  return ok({ category });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  if (parsed.data.fieldDefinitions != null) {
    const fdCheck = validateFieldDefinitions(parsed.data.fieldDefinitions);
    if (!fdCheck.ok) return fail(fdCheck.message, { status: 400, code: "BAD_FIELD_SCHEMA" });
  }

  await connectToDatabase();

  const existing = await CategoryModel.findById(id).lean();
  if (!existing) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  const u: Record<string, unknown> = {};
  if (parsed.data.name != null) u.name = parsed.data.name.trim();
  if (parsed.data.description !== undefined) u.description = parsed.data.description?.trim() ?? "";
  if (parsed.data.status != null) u.status = parsed.data.status;
  if (parsed.data.fieldDefinitions != null) u.fieldDefinitions = parsed.data.fieldDefinitions;
  if (parsed.data.sortOrder != null) u.sortOrder = parsed.data.sortOrder;

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
