import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/Category";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
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

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  parentId: z.string().nullable().optional(),
  imageUrl: z.string().url().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  fieldDefinitions: z.array(FieldDefSchema).max(200).optional(),
  seo: z
    .object({
      title: z.string().max(120).optional(),
      description: z.string().max(300).optional(),
      keywords: z.array(z.string().max(40)).optional(),
    })
    .optional(),
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

export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";

  const filter: Record<string, unknown> = all && auth.session.role === RoleKey.SUPER_ADMIN ? {} : { status: "active" };
  const categories = await CategoryModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return ok({ categories });
}

export async function POST(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  const fdCheck = validateFieldDefinitions(parsed.data.fieldDefinitions);
  if (!fdCheck.ok) return fail(fdCheck.message, { status: 400, code: "BAD_FIELD_SCHEMA" });

  await connectToDatabase();

  const slug = parsed.data.slug.toLowerCase().trim();
  const existing = await CategoryModel.findOne({ slug }).lean();
  if (existing) return fail("Category slug already exists", { status: 409, code: "DUPLICATE_SLUG" });

  const created = await CategoryModel.create({
    ...parsed.data,
    slug,
    createdByUserId: auth.session.userId,
  });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "CATEGORY_CREATE",
    entityType: "Category",
    entityId: String(created._id),
    newValue: created.toObject(),
  });

  return ok({ category: created }, { status: 201 });
}
