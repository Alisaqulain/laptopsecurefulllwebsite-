import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { ProductModel } from "@/lib/db/models/Product";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const CreateSchema = z.object({
  sku: z.string().min(2).max(40),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160),
  categoryId: z.string().min(1),
  brand: z.string().max(50).optional(),
  processor: z.string().max(80).optional(),
  ram: z.string().max(40).optional(),
  storage: z.string().max(60).optional(),
  graphics: z.string().max(80).optional(),
  color: z.string().max(40).optional(),
  condition: z.enum(["new", "refurbished", "used"]).optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  pricing: z.object({
    sellingPrice: z.number().min(0),
    purchasePriceAvg: z.number().min(0).optional(),
    gstRate: z.number().min(0).max(100).optional(),
    mrp: z.number().min(0).optional(),
  }),
  stock: z
    .object({
      onHand: z.number().int().min(0).optional(),
      reserved: z.number().int().min(0).optional(),
      sold: z.number().int().min(0).optional(),
      lowStockThreshold: z.number().int().min(0).optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().max(120).optional(),
      description: z.string().max(300).optional(),
      keywords: z.array(z.string().max(40)).optional(),
    })
    .optional(),
});

function projectForRole(role: string) {
  // Sales must never see purchase price / profit fields.
  if (role === RoleKey.SALES_ADMIN) {
    return {
      sku: 1,
      name: 1,
      slug: 1,
      categoryId: 1,
      brand: 1,
      processor: 1,
      ram: 1,
      storage: 1,
      graphics: 1,
      color: 1,
      condition: 1,
      images: 1,
      featured: 1,
      status: 1,
      "pricing.sellingPrice": 1,
      "pricing.gstRate": 1,
      stock: 1,
      createdAt: 1,
      updatedAt: 1,
    } as const;
  }
  // Website admin: can manage products but still should not see purchase price.
  if (role === RoleKey.WEBSITE_ADMIN) {
    return {
      sku: 1,
      name: 1,
      slug: 1,
      categoryId: 1,
      brand: 1,
      processor: 1,
      ram: 1,
      storage: 1,
      graphics: 1,
      color: 1,
      condition: 1,
      images: 1,
      featured: 1,
      status: 1,
      pricing: { sellingPrice: 1, gstRate: 1, mrp: 1 },
      stock: 1,
      seo: 1,
      createdAt: 1,
      updatedAt: 1,
    } as const;
  }
  // Super admin: full view.
  return undefined;
}

export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const status = url.searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (q) filter.$text = { $search: q };
  if (status && ["active", "inactive"].includes(status)) filter.status = status;

  const projection = projectForRole(auth.session.role);
  const products = await ProductModel.find(filter, projection as any)
    .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .limit(200)
    .lean();

  return ok({ products });
}

export async function POST(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  // Website admin is allowed to create products, but must not set purchasePriceAvg.
  if (auth.session.role === RoleKey.WEBSITE_ADMIN && parsed.data.pricing.purchasePriceAvg != null) {
    return fail("Forbidden field: purchase price", { status: 403, code: "FORBIDDEN_FIELD" });
  }

  await connectToDatabase();

  const slug = parsed.data.slug.toLowerCase().trim();
  const sku = parsed.data.sku.trim();
  const existing = await ProductModel.findOne({ $or: [{ slug }, { sku }] }).lean();
  if (existing) return fail("Product slug/SKU already exists", { status: 409, code: "DUPLICATE_PRODUCT" });

  const created = await ProductModel.create({
    ...parsed.data,
    slug,
    sku,
  });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "PRODUCT_CREATE",
    entityType: "Product",
    entityId: String(created._id),
    newValue: created.toObject(),
  });

  return ok({ product: created }, { status: 201 });
}

