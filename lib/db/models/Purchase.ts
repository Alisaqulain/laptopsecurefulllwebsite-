import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PurchaseItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true },
    attributes: { type: Schema.Types.Mixed, default: {} },
    quantity: { type: Number, required: true, min: 1 },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    gstRate: { type: Number, default: 0, min: 0, max: 100 },
    gstAmount: { type: Number, default: 0, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { _id: false },
);

const PurchaseSchema = new Schema(
  {
    date: { type: Date, required: true, index: true },
    invoiceNumber: { type: String, required: true, index: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true, index: true },

    items: { type: [PurchaseItemSchema], default: [] },

    totals: {
      quantity: { type: Number, default: 0, min: 0 },
      subTotal: { type: Number, default: 0, min: 0 },
      gstTotal: { type: Number, default: 0, min: 0 },
      finalTotal: { type: Number, default: 0, min: 0 },
    },

    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
    deletedByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    demoSeed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

PurchaseSchema.index({ invoiceNumber: 1, supplierId: 1 });

export type PurchaseDoc = InferSchemaType<typeof PurchaseSchema> & { _id: mongoose.Types.ObjectId };
export const PurchaseModel = mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
