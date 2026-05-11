import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    phone: { type: String, index: true },
    gstNumber: { type: String, index: true },
    address: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

export type CustomerDoc = InferSchemaType<typeof CustomerSchema> & { _id: mongoose.Types.ObjectId };
export const CustomerModel = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

