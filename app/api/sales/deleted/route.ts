import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { ok } from "@/lib/http/apiResponse";
import { SaleModel } from "@/lib/db/models/Sale";
import { UserModel } from "@/lib/db/models/User";

export async function GET(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20) || 20));
  const skip = (page - 1) * limit;
  const q = url.searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = { deletedAt: { $ne: null } };
  if (q) {
    filter.$or = [
      { invoiceNumber: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { "customerSnapshot.name": new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { "customerSnapshot.phone": new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
    ];
  }

  const [rows, total] = await Promise.all([
    SaleModel.find(filter)
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({ invoiceNumber: 1, date: 1, deletedAt: 1, deletedByUserId: 1, customerSnapshot: 1, totals: 1, items: 1, deleteReason: 1 })
      .lean(),
    SaleModel.countDocuments(filter),
  ]);

  const userIds = Array.from(new Set(rows.map((r: any) => String(r.deletedByUserId ?? "")).filter(Boolean)));
  const users = userIds.length ? await UserModel.find({ _id: { $in: userIds } }).select({ name: 1, role: 1 }).lean() : [];
  const userMap = new Map(users.map((u: any) => [String(u._id), u]));

  const sales = rows.map((r: any) => ({
    ...r,
    deletedBy: r.deletedByUserId ? userMap.get(String(r.deletedByUserId)) ?? null : null,
  }));

  return ok({ sales, page, limit, total });
}

