import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AuditLogSchema = new Schema(
  {
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    actorRole: { type: String, index: true },
    actorIp: { type: String },

    action: { type: String, required: true, index: true }, // e.g. SALE_DELETE, PURCHASE_CREATE
    entityType: { type: String, required: true, index: true }, // Sale, Purchase, Product...
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },

    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    message: { type: String },
  },
  { timestamps: true },
);

AuditLogSchema.index({ createdAt: -1 });

export type AuditLogDoc = InferSchemaType<typeof AuditLogSchema> & { _id: mongoose.Types.ObjectId };
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

