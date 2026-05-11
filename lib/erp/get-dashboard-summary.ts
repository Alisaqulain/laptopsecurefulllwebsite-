import { connectToDatabase } from "@/lib/db/connect";
import { PurchaseModel } from "@/lib/db/models/Purchase";
import { SaleModel } from "@/lib/db/models/Sale";
import { ProductModel } from "@/lib/db/models/Product";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function getSuperAdminDashboardSummary() {
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
    {
      name: 1,
      sku: 1,
      "stock.onHand": 1,
      "stock.lowStockThreshold": 1,
      "pricing.purchasePriceAvg": 1,
      "pricing.sellingPrice": 1,
    },
  ).lean();

  const lowStock = products.filter((p) => (p.stock?.onHand ?? 0) <= (p.stock?.lowStockThreshold ?? 0));

  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock?.onHand ?? 0), 0);

  const recentSales = await SaleModel.find({ deletedAt: null }, { invoiceNumber: 1, date: 1, "totals.finalTotal": 1 })
    .sort({ date: -1 })
    .limit(8)
    .lean();

  const recentPurchases = await PurchaseModel.find(
    { deletedAt: null },
    { invoiceNumber: 1, date: 1, "totals.finalTotal": 1 },
  )
    .sort({ date: -1 })
    .limit(8)
    .lean();

  const recentActivity = await AuditLogModel.find(
    { action: { $in: ["SALE_CREATE", "SALE_DELETE", "SALE_RESTORE", "PURCHASE_CREATE", "AUTH_LOGIN_SUCCESS"] } },
    { action: 1, actorRole: 1, actorUserId: 1, createdAt: 1, message: 1, newValue: 1, entityType: 1, entityId: 1 },
  )
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

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

  const purchaseByMonthAgg = await PurchaseModel.aggregate([
    { $match: { deletedAt: null, date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    {
      $group: {
        _id: { y: { $year: "$date" }, m: { $month: "$date" } },
        total: { $sum: "$totals.finalTotal" },
      },
    },
  ]);

  const salesMap = new Map<string, number>();
  for (const row of salesByMonthAgg) {
    const k = `${row._id.y}-${String(row._id.m).padStart(2, "0")}`;
    salesMap.set(k, row.total ?? 0);
  }
  const purchaseMap = new Map<string, number>();
  for (const row of purchaseByMonthAgg) {
    const k = `${row._id.y}-${String(row._id.m).padStart(2, "0")}`;
    purchaseMap.set(k, row.total ?? 0);
  }

  const salesTrend = months.map((k) => ({ month: k, sales: salesMap.get(k) ?? 0 }));
  const purchaseTrend = months.map((k) => ({ month: k, purchases: purchaseMap.get(k) ?? 0 }));

  return {
    cards: {
      totalSales: salesAgg?.total ?? 0,
      totalPurchases: purchaseAgg?.total ?? 0,
      totalStockUnits,
      lowStockCount: lowStock.length,
    },
    recentSales: recentSales.map((s) => ({
      id: String(s._id),
      invoiceNumber: s.invoiceNumber,
      date: s.date,
      total: s.totals?.finalTotal ?? 0,
    })),
    recentPurchases: recentPurchases.map((p) => ({
      id: String(p._id),
      invoiceNumber: p.invoiceNumber,
      date: p.date,
      total: p.totals?.finalTotal ?? 0,
    })),
    recentActivity: recentActivity.map((a) => ({
      id: String(a._id),
      action: a.action,
      actorRole: a.actorRole ?? "",
      createdAt: a.createdAt,
      message: a.message ?? "",
      newValue: a.newValue ?? null,
      entityType: a.entityType,
      entityId: String(a.entityId),
    })),
    salesTrend,
    purchaseTrend,
  };
}
