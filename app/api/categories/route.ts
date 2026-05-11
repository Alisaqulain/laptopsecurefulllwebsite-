import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/Category";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(120),
  parentId: z.string().nullable().optional(),
  imageUrl: z.string().url().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  seo: z
    .object({
      title: z.string().max(120).optional(),
      description: z.string().max(300).optional(),
      keywords: z.array(z.string().max(40)).optional(),
    })
    .optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
});

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

  await connectToDatabase();

  const existing = await CategoryModel.findOne({ slug: parsed.data.slug.toLowerCase().trim() }).lean();
  if (existing) return fail("Category slug already exists", { status: 409, code: "DUPLICATE_SLUG" });

  const created = await CategoryModel.create({
    ...parsed.data,
    slug: parsed.data.slug.toLowerCase().trim(),
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

