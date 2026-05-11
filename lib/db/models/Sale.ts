import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SaleItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    gstRate: { type: Number, default: 0, min: 0, max: 100 },
    gstAmount: { type: Number, default: 0, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    basicSpecs: { type: String },
  },
  { _id: false },
);

const SaleSchema = new Schema(
  {
    date: { type: Date, required: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card", "bank_transfer", "mixed"],
      default: "cash",
      index: true,
    },

    customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    customerSnapshot: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },

    items: { type: [SaleItemSchema], default: [] },
    totals: {
      quantity: { type: Number, default: 0, min: 0 },
      subTotal: { type: Number, default: 0, min: 0 },
      discountTotal: { type: Number, default: 0, min: 0 },
      gstTotal: { type: Number, default: 0, min: 0 },
      finalTotal: { type: Number, default: 0, min: 0 },
    },

    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
    deletedByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleteReason: { type: String },
    demoSeed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type SaleDoc = InferSchemaType<typeof SaleSchema> & { _id: mongoose.Types.ObjectId };
export const SaleModel = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

