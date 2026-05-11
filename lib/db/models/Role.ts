import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RoleSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true },
);

RoleSchema.index({ key: 1 }, { unique: true });

export type RoleDoc = InferSchemaType<typeof RoleSchema> & { _id: mongoose.Types.ObjectId };
export const RoleModel = mongoose.models.Role || mongoose.model("Role", RoleSchema);

