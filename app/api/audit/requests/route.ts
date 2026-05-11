import { connectToDatabase } from "@/lib/db/connect";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { ok } from "@/lib/http/apiResponse";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

export async function GET() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const rows = await AuditLogModel.find(
    { action: { $in: ["SALE_DELETE_REQUEST", "PURCHASE_DELETE_REQUEST"] } },
    { action: 1, entityType: 1, entityId: 1, actorUserId: 1, actorRole: 1, createdAt: 1, message: 1, newValue: 1 },
  )
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return ok({ requests: rows });
}

