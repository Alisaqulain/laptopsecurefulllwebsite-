import { connectToDatabase } from "@/lib/db/connect";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import mongoose from "mongoose";

export async function writeAuditLog(entry: {
  actorUserId?: string | null;
  actorRole?: string | null;
  actorIp?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: unknown;
  newValue?: unknown;
  message?: string;
}) {
  await connectToDatabase();
  await AuditLogModel.create({
    actorUserId: entry.actorUserId ?? null,
    actorRole: entry.actorRole ?? undefined,
    actorIp: entry.actorIp ?? undefined,
    action: entry.action,
    entityType: entry.entityType,
    entityId: mongoose.Types.ObjectId.isValid(entry.entityId)
      ? new mongoose.Types.ObjectId(entry.entityId)
      : new mongoose.Types.ObjectId("000000000000000000000000"),
    oldValue: entry.oldValue,
    newValue: entry.newValue,
    message: entry.message,
  });
}

