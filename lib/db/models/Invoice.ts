import mongoose, { Schema, type InferSchemaType } from "mongoose";

const InvoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    saleId: { type: Schema.Types.ObjectId, ref: "Sale", required: true, unique: true, index: true },
    pdfUrl: { type: String }, // optional: if you later store generated PDFs
    snapshot: { type: Schema.Types.Mixed }, // full snapshot used for re-printing even if product changes
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

export type InvoiceDoc = InferSchemaType<typeof InvoiceSchema> & { _id: mongoose.Types.ObjectId };
export const InvoiceModel = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

