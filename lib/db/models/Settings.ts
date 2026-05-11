import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SettingsSchema = new Schema(
  {
    company: {
      name: { type: String, default: "LaptopSecure" },
      logoUrl: { type: String },
      address: { type: String },
      gstNumber: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    invoice: {
      terms: { type: [String], default: ["Goods once sold will not be taken back."] },
      signatureLabel: { type: String, default: "Authorized Signatory" },
      nextInvoiceSeq: { type: Number, default: 1, min: 1 },
      prefix: { type: String, default: "LS" },
    },
  },
  { timestamps: true },
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema> & { _id: mongoose.Types.ObjectId };
export const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

