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
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const LineSchema = z.object({
  categoryId: z.string().min(1),
  productName: z.string().min(1).max(200),
  brand: z.string().max(80).optional(),
  processor: z.string().max(120).optional(),
  ram: z.string().max(60).optional(),
  ssd: z.string().max(60).optional(),
  color: z.string().max(60).optional(),
  condition: z.enum(["new", "refurbished", "used"]).optional(),
  quantity: z.number().int().min(1),
  purchasePrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  gstPercent: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
});

const PostSchema = z.object({
  supplierId: z.string().min(1),
  date: z.string().min(1),
  invoiceNumber: z.string().min(1).max(80),
  lines: z.array(LineSchema).min(1),
  notes: z.string().max(2000).optional(),
});

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

export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20) || 20));
  const skip = (page - 1) * limit;
  const q = url.searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = { deletedAt: null };
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

        const cond: "new" | "refurbished" | "used" =
          line.condition === "new" || line.condition === "refurbished" ? line.condition : "used";

        const match = {
          categoryId: catId,
          name: line.productName.trim(),
          brand: (line.brand ?? "").trim(),
          processor: (line.processor ?? "").trim(),
          ram: (line.ram ?? "").trim(),
          storage: (line.ssd ?? "").trim(),
          color: (line.color ?? "").trim(),
          condition: cond,
        };

        let product = await ProductModel.findOne(match).session(session);
        const qty = line.quantity;
        const purchasePrice = line.purchasePrice;
        const sellingPrice = line.sellingPrice;
        const gstRate = line.gstPercent ?? 0;
        const base = qty * purchasePrice;
        const gstAmount = (base * gstRate) / 100;
        const lineTotal = base + gstAmount;

        if (!product) {
          const sku = await uniqueSku(session);
          const slug = await uniqueSlug(line.productName, session);
          const [created] = await ProductModel.create(
            [
              {
                sku,
                slug,
                categoryId: catId,
                name: line.productName.trim(),
                brand: line.brand?.trim(),
                processor: line.processor?.trim(),
                ram: line.ram?.trim(),
                storage: line.ssd?.trim(),
                color: line.color?.trim(),
                condition: cond,
                pricing: {
                  sellingPrice,
                  purchasePriceAvg: purchasePrice,
                  gstRate,
                },
                stock: { onHand: qty, lowStockThreshold: 2 },
              },
            ],
            { session },
          );
          product = created;
        } else {
          const oldOn = product.stock?.onHand ?? 0;
          const oldAvg = product.pricing?.purchasePriceAvg ?? 0;
          const newAvg =
            oldOn + qty === 0 ? purchasePrice : (oldOn * oldAvg + qty * purchasePrice) / (oldOn + qty);
          await ProductModel.findByIdAndUpdate(
            product._id,
            {
              $inc: { "stock.onHand": qty },
              $set: {
                "pricing.purchasePriceAvg": newAvg,
                "pricing.sellingPrice": sellingPrice,
                "pricing.gstRate": gstRate,
              },
            },
            { session },
          );
        }

        items.push({
          productId: product!._id,
          categoryId: catId,
          name: line.productName.trim(),
          brand: line.brand?.trim(),
          processor: line.processor?.trim(),
          ram: line.ram?.trim(),
          storage: line.ssd?.trim(),
          color: line.color?.trim(),
          condition: cond,
          quantity: qty,
          purchasePrice,
          sellingPrice,
          gstRate,
          gstAmount,
          lineTotal,
          notes: line.notes?.trim(),
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
