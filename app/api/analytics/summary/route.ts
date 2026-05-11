import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { ok } from "@/lib/http/apiResponse";
import { PurchaseModel } from "@/lib/db/models/Purchase";
import { SaleModel } from "@/lib/db/models/Sale";
import { ProductModel } from "@/lib/db/models/Product";

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();

  const [purchaseAgg] = await PurchaseModel.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: null, total: { $sum: "$totals.finalTotal" } } },
  ]);

  const [salesAgg] = await SaleModel.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: null, total: { $sum: "$totals.finalTotal" } } },
  ]);

  const products = await ProductModel.find(
    {},
    { "stock.onHand": 1, "stock.lowStockThreshold": 1, "pricing.purchasePriceAvg": 1, name: 1, sku: 1 },
  ).lean();

  const lowStock = products.filter((p) => (p.stock?.onHand ?? 0) <= (p.stock?.lowStockThreshold ?? 0));
  const currentStockValue = products.reduce((sum, p) => {
    const qty = p.stock?.onHand ?? 0;
    const cost = p.pricing?.purchasePriceAvg ?? 0;
    return sum + qty * cost;
  }, 0);

  const recentSales = await SaleModel.find({ deletedAt: null }, { invoiceNumber: 1, date: 1, "totals.finalTotal": 1 })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  const recentPurchases = await PurchaseModel.find(
    { deletedAt: null },
    { invoiceNumber: 1, date: 1, "totals.finalTotal": 1 },
  )
    .sort({ date: -1 })
    .limit(5)
    .lean();

  // Simple 6-month sales trend
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }

  const salesByMonthAgg = await SaleModel.aggregate([
    { $match: { deletedAt: null, date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    {
      $group: {
        _id: { y: { $year: "$date" }, m: { $month: "$date" } },
        total: { $sum: "$totals.finalTotal" },
      },
    },
  ]);

  const map = new Map<string, number>();
  for (const row of salesByMonthAgg) {
    const k = `${row._id.y}-${String(row._id.m).padStart(2, "0")}`;
    map.set(k, row.total ?? 0);
  }

  const salesTrend = months.map((k) => ({ month: k, sales: map.get(k) ?? 0 }));

  return ok({
    cards: {
      totalPurchaseAmount: purchaseAgg?.total ?? 0,
      totalSalesAmount: salesAgg?.total ?? 0,
      currentStockValue,
      lowStockCount: lowStock.length,
    },
    recentSales,
    recentPurchases,
    salesTrend,
  });
}

