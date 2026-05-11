import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    brand: { type: String, index: true },
    processor: { type: String, index: true },
    ram: { type: String, index: true },
    storage: { type: String, index: true },
    graphics: { type: String, index: true },
    color: { type: String },
    condition: { type: String, enum: ["new", "refurbished", "used"], default: "used", index: true },

    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },

    pricing: {
      sellingPrice: { type: Number, required: true, min: 0 },
      // purchasePrice is intentionally stored but must be hidden from sales/website admins via API projection
      purchasePriceAvg: { type: Number, default: 0, min: 0 },
      gstRate: { type: Number, default: 0, min: 0, max: 100 },
      mrp: { type: Number, default: 0, min: 0 },
    },

    stock: {
      onHand: { type: Number, default: 0, min: 0, index: true },
      reserved: { type: Number, default: 0, min: 0 },
      sold: { type: Number, default: 0, min: 0 },
      lowStockThreshold: { type: Number, default: 2, min: 0 },
    },

    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", brand: "text", processor: "text", ram: "text", storage: "text" });

export type ProductDoc = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };
export const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);

