import { z } from "zod";
import mongoose, { Types } from "mongoose";
import { randomBytes } from "crypto";
import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { ProductModel } from "@/lib/db/models/Product";
import { SaleModel } from "@/lib/db/models/Sale";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const PostSchema = z.object({
  customerName: z.string().min(1).max(120),
  customerPhone: z.string().min(6).max(20),
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  discount: z.number().min(0).optional(),
  gstPercent: z.number().min(0).max(100).optional(),
  paymentMode: z.enum(["cash", "upi", "card", "bank_transfer"]),
  notes: z.string().max(500).optional(),
});

function invoiceNo() {
  return `LS-${Date.now().toString(36)}${randomBytes(2).toString("hex")}`.toUpperCase();
}

export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20) || 20));
  const skip = (page - 1) * limit;
  const q = url.searchParams.get("q")?.trim();

  // ONE central sales collection — all roles see all sales.
  const filter: Record<string, unknown> = { deletedAt: null };
  if (q) {
    filter.$or = [
      { invoiceNumber: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { "customerSnapshot.name": new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { "customerSnapshot.phone": new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
    ];
  }

  // Both roles see all amounts — only purchase cost is hidden for SALES_ADMIN (handled at product API level).
  const showAmounts = true;
  const canDelete = true;

  const [rows, total] = await Promise.all([
    SaleModel.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select({ invoiceNumber: 1, date: 1, customerSnapshot: 1, paymentMode: 1, items: 1, totals: 1, createdByUserId: 1 })
      .lean(),
    SaleModel.countDocuments(filter),
  ]);

  // Resolve creator names in one query.
  const { UserModel } = await import("@/lib/db/models/User");
  const userIds = [...new Set(rows.map((r: any) => String(r.createdByUserId ?? "")).filter(Boolean))];
  const users = userIds.length ? await UserModel.find({ _id: { $in: userIds } }).select({ name: 1, role: 1 }).lean() : [];
  const userMap = new Map(users.map((u: any) => [String(u._id), { name: u.name as string, role: u.role as string }]));

  const sales = rows.map((r: any) => ({
    ...r,
    createdBy: r.createdByUserId ? (userMap.get(String(r.createdByUserId)) ?? null) : null,
  }));

  return ok({ sales, page, limit, total, meta: { showAmounts, canDelete } });
}

export async function POST(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const productId = new Types.ObjectId(parsed.data.productId);
  const qty = parsed.data.quantity;

  const session = await mongoose.startSession();
  let saleId: string | null = null;
  let inv = "";

  try {
    await session.withTransaction(async () => {
      const product = await ProductModel.findById(productId).session(session);
      if (!product) throw new Error("NO_PRODUCT");

      const price = parsed.data.price;
      const discount = parsed.data.discount ?? 0;
      const gstRate = parsed.data.gstPercent ?? 0;

      const onHand = product.stock?.onHand ?? 0;
      if (onHand < qty) throw new Error("NO_STOCK");
      if (price <= 0) throw new Error("BAD_PRICE");

      const lineNet = qty * price - discount;
      if (lineNet < 0) throw new Error("BAD_DISCOUNT");
      const gstAmount = (lineNet * gstRate) / 100;
      const lineTotal = lineNet + gstAmount;

      inv = invoiceNo();
      const exists = await SaleModel.findOne({ invoiceNumber: inv }).session(session).lean();
      if (exists) {
        inv = invoiceNo();
      }

      await ProductModel.findByIdAndUpdate(
        productId,
        { $inc: { "stock.onHand": -qty, "stock.sold": qty } },
        { session },
      );

      const [sale] = await SaleModel.create(
        [
          {
            date: new Date(),
            invoiceNumber: inv,
            paymentMode: parsed.data.paymentMode,
            customerSnapshot: {
              name: parsed.data.customerName.trim(),
              phone: parsed.data.customerPhone.trim(),
            },
            items: [
              {
                productId,
                categoryId: product.categoryId,
                name: product.name,
                quantity: qty,
                sellingPrice: price,
                discount,
                gstRate,
                gstAmount,
                lineTotal,
              },
            ],
            totals: {
              quantity: qty,
              subTotal: qty * price,
              discountTotal: discount,
              gstTotal: gstAmount,
              finalTotal: lineTotal,
            },
            notes: parsed.data.notes?.trim(),
            createdByUserId: new Types.ObjectId(auth.session.userId),
          },
        ],
        { session },
      );
      saleId = String(sale._id);
    });
  } catch (e) {
    const code = e instanceof Error ? e.message : "";
    if (code === "NO_PRODUCT") return fail("Product not found", { status: 404, code: "NOT_FOUND" });
    if (code === "NO_STOCK") return fail("Not enough stock for this quantity", { status: 400, code: "NO_STOCK" });
    if (code === "BAD_PRICE") return fail("Product has no selling price on file", { status: 400, code: "BAD_PRICE" });
    if (code === "BAD_DISCOUNT") return fail("Discount too large", { status: 400, code: "BAD_DISCOUNT" });
    return fail("Could not save sale", { status: 500, code: "SALE_FAILED" });
  } finally {
    await session.endSession();
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SALE_CREATE",
    entityType: "Sale",
    entityId: saleId ?? "",
    newValue: { invoiceNumber: inv },
  }).catch(() => null);

  const sale = await SaleModel.findById(saleId).lean();
  return ok({ sale }, { status: 201 });
}
