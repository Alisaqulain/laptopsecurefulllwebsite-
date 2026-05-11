import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { ProductModel } from "@/lib/db/models/Product";
import { CategoryModel } from "@/lib/db/models/Category";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";
import { validateCategoryAttributes, compactAttributes } from "@/lib/inventory/validateCategoryAttributes";

const CreateSchema = z.object({
  sku: z.string().min(2).max(40),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160),
  categoryId: z.string().min(1),
  attributes: z.record(z.string(), z.unknown()).optional(),
  brand: z.string().max(80).optional(),
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

function deriveBrand(attrs: Record<string, unknown>): string {
  const b = attrs.brand ?? attrs.accessoryBrand;
  return typeof b === "string" ? b.trim() : "";
}

function projectForRole(role: string) {
  const base = {
    sku: 1,
    name: 1,
    slug: 1,
    categoryId: 1,
    attributes: 1,
    brand: 1,
    images: 1,
    featured: 1,
    status: 1,
    stock: 1,
    createdAt: 1,
    updatedAt: 1,
  } as const;

  /** Sales staff: get suggested selling price + GST rate for reference hint; purchase cost is never returned. */
  if (role === RoleKey.SALES_ADMIN) {
    return { ...base, "pricing.sellingPrice": 1, "pricing.gstRate": 1 } as const;
  }
  if (role === RoleKey.WEBSITE_ADMIN) {
    return {
      ...base,
      pricing: { sellingPrice: 1, gstRate: 1, mrp: 1 },
      seo: 1,
    } as const;
  }
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
    .populate("categoryId", "name slug")
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

  if (auth.session.role === RoleKey.WEBSITE_ADMIN && parsed.data.pricing.purchasePriceAvg != null) {
    return fail("Forbidden field: purchase price", { status: 403, code: "FORBIDDEN_FIELD" });
  }

  await connectToDatabase();

  const slug = parsed.data.slug.toLowerCase().trim();
  const sku = parsed.data.sku.trim();
  const existing = await ProductModel.findOne({ $or: [{ slug }, { sku }] }).lean();
  if (existing) return fail("Product slug/SKU already exists", { status: 409, code: "DUPLICATE_PRODUCT" });

  if (!mongoose.isValidObjectId(parsed.data.categoryId)) {
    return fail("Invalid category", { status: 400, code: "BAD_CATEGORY" });
  }

  const cat = await CategoryModel.findById(parsed.data.categoryId).lean();
  if (!cat) return fail("Category not found", { status: 400, code: "BAD_CATEGORY" });

  const defs = cat.fieldDefinitions ?? [];
  const rawAttrs = parsed.data.attributes ?? {};
  let attrs: Record<string, unknown> = rawAttrs;

  if (defs.length > 0) {
    const validated = validateCategoryAttributes(defs as any, rawAttrs);
    if (!validated.ok) {
      return fail(validated.errors.join("; "), { status: 400, code: "BAD_ATTRIBUTES" });
    }
    attrs = compactAttributes(validated.normalized);
  } else {
    attrs = compactAttributes(rawAttrs as Record<string, unknown>);
  }

  const brand = (parsed.data.brand ?? deriveBrand(attrs)).trim();

  const created = await ProductModel.create({
    sku,
    slug,
    categoryId: parsed.data.categoryId,
    name: parsed.data.name.trim(),
    attributes: attrs,
    brand: brand || undefined,
    images: parsed.data.images,
    featured: parsed.data.featured,
    status: parsed.data.status,
    pricing: parsed.data.pricing,
    stock: parsed.data.stock,
    seo: parsed.data.seo,
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
