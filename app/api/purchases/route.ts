import { z } from "zod";
import mongoose, { Types } from "mongoose";
import { randomBytes } from "crypto";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { CategoryModel } from "@/lib/db/models/Category";
import { SupplierModel } from "@/lib/db/models/Supplier";
import { ProductModel } from "@/lib/db/models/Product";
import { PurchaseModel } from "@/lib/db/models/Purchase";
import { slugify } from "@/lib/inventory/productMatch";
import { findProductForPurchaseLine, type PurchaseLinePayload } from "@/lib/inventory/findProductForPurchaseLine";
import { validateCategoryAttributes, compactAttributes } from "@/lib/inventory/validateCategoryAttributes";
import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";
import { deriveProductNameFromAttributes } from "@/lib/inventory/deriveProductNameFromAttributes";
import { extractCommerceFromAttributes, specAttributesOnly } from "@/lib/inventory/purchaseCommerceAttributes";

const LineSchema = z.object({
  categoryId: z.string().min(1),
  attributes: z.record(z.string(), z.unknown()).optional().default({}),
});

type LineIn = z.infer<typeof LineSchema>;

class LineValidationError extends Error {
  constructor(public issues: string[]) {
    super(issues.join("; "));
    this.name = "LineValidationError";
  }
}

const PostSchema = z.object({
  supplierId: z.string().min(1),
  date: z.string().min(1),
  invoiceNumber: z.string().min(1).max(80),
  lines: z.array(LineSchema).min(1),
  notes: z.string().max(2000).optional(),
});

function toPayload(productName: string, attributes: Record<string, unknown>): PurchaseLinePayload {
  return { productName, attributes };
}

function deriveBrand(attrs: Record<string, unknown>): string {
  const b = attrs.brand ?? attrs.accessoryBrand;
  return typeof b === "string" ? b.trim() : "";
}

async function uniqueSku(s: mongoose.ClientSession): Promise<string> {
  for (let i = 0; i < 50; i++) {
    const sku = `LS-${Date.now().toString(36)}${randomBytes(2).toString("hex")}`.toUpperCase();
    const exists = await ProductModel.findOne({ sku }).session(s).lean();
    if (!exists) return sku;
  }
  return `LS-${randomBytes(8).toString("hex").toUpperCase()}`;
}

async function uniqueSlug(base: string, s: mongoose.ClientSession): Promise<string> {
  const root = slugify(base) || "item";
  for (let i = 0; i < 30; i++) {
    const slug = i === 0 ? root : `${root}-${i}`;
    const exists = await ProductModel.findOne({ slug }).session(s).lean();
    if (!exists) return slug;
  }
  return `${root}-${randomBytes(3).toString("hex")}`;
}

async function createProductFromLine(
  session: mongoose.ClientSession,
  catId: Types.ObjectId,
  productName: string,
  specAttrs: Record<string, unknown>,
  qty: number,
  purchasePrice: number,
  sellingPrice: number,
  gstRate: number,
) {
  const sku = await uniqueSku(session);
  const slug = await uniqueSlug(productName, session);
  const brand = deriveBrand(specAttrs);

  const doc: Record<string, unknown> = {
    sku,
    slug,
    categoryId: catId,
    name: productName.trim(),
    attributes: compactAttributes(specAttrs),
    brand: brand || undefined,
    pricing: {
      sellingPrice,
      purchasePriceAvg: purchasePrice,
      gstRate,
    },
    stock: { onHand: qty, lowStockThreshold: 2 },
    status: "active",
  };

  const [created] = await ProductModel.create([doc], { session });
  return created;
}

export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const supplierFilter = url.searchParams.get("supplierId")?.trim();
  const hasSupplier = Boolean(supplierFilter && Types.ObjectId.isValid(supplierFilter));
  const requestedLimit = Number(url.searchParams.get("limit") || 20) || 20;
  const maxLimit = hasSupplier ? 100 : 50;
  const limit = Math.min(maxLimit, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;
  const q = url.searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = { deletedAt: null };
  if (hasSupplier) filter.supplierId = new Types.ObjectId(supplierFilter);
  if (q) filter.invoiceNumber = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [rows, total] = await Promise.all([
    PurchaseModel.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("supplierId", "name phone")
      .lean(),
    PurchaseModel.countDocuments(filter),
  ]);

  return ok({ purchases: rows, page, limit, total });
}

export async function POST(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const supplierId = new Types.ObjectId(parsed.data.supplierId);
  const supplier = await SupplierModel.findById(supplierId).lean();
  if (!supplier) return fail("Supplier not found", { status: 400, code: "BAD_SUPPLIER" });

  const inv = parsed.data.invoiceNumber.trim();
  const dup = await PurchaseModel.findOne({ supplierId, invoiceNumber: inv, deletedAt: null }).lean();
  if (dup) return fail("This invoice number already exists for this supplier.", { status: 409, code: "DUPLICATE_INVOICE" });

  const session = await mongoose.startSession();
  let purchaseId: string | null = null;

  try {
    await session.withTransaction(async () => {
      const items: Array<Record<string, unknown>> = [];
      let totalQty = 0;
      let subTotal = 0;
      let gstTotal = 0;

      for (const line of parsed.data.lines) {
        const catId = new Types.ObjectId(line.categoryId);
        const cat = await CategoryModel.findById(catId).session(session).lean();
        if (!cat) throw new Error("BAD_CATEGORY");

        const defs: CategoryFieldDef[] = ((cat as { fieldDefinitions?: CategoryFieldDef[] }).fieldDefinitions ??
          []) as CategoryFieldDef[];
        if (!defs.length) {
          throw new Error("BAD_CATEGORY_SCHEMA");
        }

        const validated = validateCategoryAttributes(defs, line.attributes ?? {});
        if (!validated.ok) {
          throw new LineValidationError(validated.errors);
        }

        const attrs = compactAttributes(validated.normalized);
        const catSlug = (cat as { slug?: string }).slug;
        const productName = deriveProductNameFromAttributes(catSlug, attrs);
        const commerce = extractCommerceFromAttributes(attrs);
        const { quantity: qty, purchasePrice, sellingPrice, gstPercent: gstRate, notes: lineNotes } = commerce;
        const specAttrs = compactAttributes(specAttributesOnly(attrs));
        const payload = toPayload(productName, attrs);
        const base = qty * purchasePrice;
        const gstAmount = (base * gstRate) / 100;
        const lineTotal = base + gstAmount;

        const catLean = {
          _id: cat._id as Types.ObjectId,
          slug: catSlug,
          fieldDefinitions: defs,
        };

        const { product: found, legacy } = await findProductForPurchaseLine(catLean, payload, session);
        let product = found;

        if (!product) {
          product = await createProductFromLine(
            session,
            catId,
            productName,
            specAttrs,
            qty,
            purchasePrice,
            sellingPrice,
            gstRate,
          );
        } else {
          const oldOn = product.stock?.onHand ?? 0;
          const oldAvg = product.pricing?.purchasePriceAvg ?? 0;
          const newAvg = oldOn + qty === 0 ? purchasePrice : (oldOn * oldAvg + qty * purchasePrice) / (oldOn + qty);

          const $set: Record<string, unknown> = {
            "pricing.purchasePriceAvg": newAvg,
            "pricing.sellingPrice": sellingPrice,
            "pricing.gstRate": gstRate,
            name: productName.trim(),
            brand: deriveBrand(specAttrs) || "",
            attributes: specAttrs,
          };

          const $unset: Record<string, string> = {};
          if (legacy) {
            ["processor", "ram", "storage", "graphics", "color", "condition", "model", "productType", "capacity", "version"].forEach((k) => {
              $unset[k] = "";
            });
          }

          await ProductModel.findByIdAndUpdate(
            product._id,
            { $inc: { "stock.onHand": qty }, $set: $set, ...(Object.keys($unset).length ? { $unset } : {}) },
            { session },
          );
        }

        items.push({
          productId: product!._id,
          categoryId: catId,
          name: productName.trim(),
          attributes: attrs,
          quantity: qty,
          purchasePrice,
          sellingPrice,
          gstRate,
          gstAmount,
          lineTotal,
          notes: lineNotes || undefined,
        });

        totalQty += qty;
        subTotal += base;
        gstTotal += gstAmount;
      }

      const [doc] = await PurchaseModel.create(
        [
          {
            date: new Date(parsed.data.date),
            invoiceNumber: inv,
            supplierId,
            items,
            totals: {
              quantity: totalQty,
              subTotal,
              gstTotal,
              finalTotal: subTotal + gstTotal,
            },
            notes: parsed.data.notes?.trim(),
            createdByUserId: new Types.ObjectId(auth.session.userId),
          },
        ],
        { session },
      );
      purchaseId = String(doc._id);
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Transaction failed";
    if (msg === "BAD_CATEGORY") return fail("Invalid category on a line item", { status: 400, code: "BAD_CATEGORY" });
    if (msg === "BAD_CATEGORY_SCHEMA") {
      return fail("A category has no field schema. Configure fields under Categories or run seed defaults.", {
        status: 400,
        code: "BAD_CATEGORY_SCHEMA",
      });
    }
    if (e instanceof LineValidationError) {
      return fail(e.message, { status: 400, code: "LINE_VALIDATION" });
    }
    return fail("Could not save purchase. Try again.", { status: 500, code: "PURCHASE_FAILED" });
  } finally {
    await session.endSession();
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "PURCHASE_CREATE",
    entityType: "Purchase",
    entityId: purchaseId ?? "",
  }).catch(() => null);

  const created = await PurchaseModel.findById(purchaseId).lean();
  return ok({ purchase: created }, { status: 201 });
}
