import { connectToDatabase } from "@/lib/db/connect";
import { SaleModel } from "@/lib/db/models/Sale";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { ok } from "@/lib/http/apiResponse";

/** List sales with outstanding udhari (credit / debt). */
export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20) || 20));
  const skip = (page - 1) * limit;
  const q = url.searchParams.get("q")?.trim();
  const status = url.searchParams.get("status") || "open";

  const filter: Record<string, unknown> = { deletedAt: null };
  if (status === "open") {
    filter["udhari.balanceDue"] = { $gt: 0 };
  } else if (status === "settled") {
    filter["udhari.balanceDue"] = { $lte: 0 };
    filter["udhari.payments.0"] = { $exists: true };
  } else {
    filter.$or = [{ "udhari.balanceDue": { $gt: 0 } }, { "udhari.payments.0": { $exists: true } }];
  }

  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const search = {
      $or: [
        { invoiceNumber: re },
        { "customerSnapshot.name": re },
        { "customerSnapshot.phone": re },
      ],
    };
    const prev = { ...filter };
    Object.keys(filter).forEach((k) => delete filter[k]);
    filter.$and = [prev, search];
  }

  const [rows, total] = await Promise.all([
    SaleModel.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        invoiceNumber: 1,
        date: 1,
        customerSnapshot: 1,
        paymentMode: 1,
        items: 1,
        totals: 1,
        udhari: 1,
        createdByUserId: 1,
      })
      .lean(),
    SaleModel.countDocuments(filter),
  ]);

  const entries = rows.map((r: any) => ({
    _id: String(r._id),
    invoiceNumber: r.invoiceNumber,
    date: r.date,
    customerSnapshot: r.customerSnapshot,
    paymentMode: r.paymentMode,
    items: r.items,
    totals: r.totals,
    udhari: r.udhari ?? { amountReceived: r.totals?.finalTotal ?? 0, balanceDue: 0, payments: [] },
  }));

  const openAgg = await SaleModel.aggregate([
    { $match: { deletedAt: null, "udhari.balanceDue": { $gt: 0 } } },
    { $group: { _id: null, totalDue: { $sum: "$udhari.balanceDue" }, count: { $sum: 1 } } },
  ]);
  const summary = {
    openCount: openAgg[0]?.count ?? 0,
    totalDue: openAgg[0]?.totalDue ?? 0,
  };

  return ok({ entries, page, limit, total, summary });
}
