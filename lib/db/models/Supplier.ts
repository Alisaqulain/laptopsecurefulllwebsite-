import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    phone: { type: String, index: true },
    gstNumber: { type: String, index: true },
    address: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export type SupplierDoc = InferSchemaType<typeof SupplierSchema> & { _id: mongoose.Types.ObjectId };
export const SupplierModel = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

