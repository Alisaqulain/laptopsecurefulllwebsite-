import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    /** Category-driven specs (keys match Category.fieldDefinitions[].id) */
    attributes: { type: Schema.Types.Mixed, default: {} },

    /** Optional display brand (also often duplicated inside attributes) */
    brand: { type: String, index: true, trim: true },

    /** @deprecated Legacy flat keys — prefer `attributes`. Kept so old stock rows still match until migrated. */
    processor: { type: String },
    ram: { type: String },
    storage: { type: String },
    graphics: { type: String },
    color: { type: String },
    condition: { type: String },
    model: { type: String },
    productType: { type: String },

    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },

    pricing: {
      sellingPrice: { type: Number, required: true, min: 0 },
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
    demoSeed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

ProductSchema.index({
  name: "text",
  brand: "text",
});

export type ProductDoc = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };
export const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
