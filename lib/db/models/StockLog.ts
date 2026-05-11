import mongoose, { Schema, type InferSchemaType } from "mongoose";

const StockLogSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    type: {
      type: String,
      enum: ["purchase_in", "sale_out", "manual_adjust", "restore", "reserve", "unreserve"],
      required: true,
      index: true,
    },
    qtyChange: { type: Number, required: true },
    onHandAfter: { type: Number, required: true, min: 0 },
    meta: { type: Schema.Types.Mixed },
    ref: {
      purchaseId: { type: Schema.Types.ObjectId, ref: "Purchase", default: null, index: true },
      saleId: { type: Schema.Types.ObjectId, ref: "Sale", default: null, index: true },
    },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

StockLogSchema.index({ createdAt: -1 });

export type StockLogDoc = InferSchemaType<typeof StockLogSchema> & { _id: mongoose.Types.ObjectId };
export const StockLogModel = mongoose.models.StockLog || mongoose.model("StockLog", StockLogSchema);

