import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { CATEGORY_FIELD_TYPES } from "@/lib/inventory/categoryFieldTypes";

const CategoryFieldDefSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, enum: CATEGORY_FIELD_TYPES, required: true },
    required: { type: Boolean, default: false },
    placeholder: { type: String, trim: true },
    options: { type: [String], default: undefined },
    order: { type: Number, default: 0, index: true },
    isMatchKey: { type: Boolean, default: false },
  },
  { _id: false },
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, index: true },
    description: { type: String, trim: true, maxlength: 500 },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    imageUrl: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    /** Admin-defined dynamic fields for purchase + product attributes */
    fieldDefinitions: { type: [CategoryFieldDefSchema], default: [] },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: [String], default: [] },
    },
    sortOrder: { type: Number, default: 0, index: true },
    /** True only for LaptopSecure demo seed — safe to bulk-delete. */
    demoSeed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

CategorySchema.index({ slug: 1 }, { unique: true });

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & { _id: mongoose.Types.ObjectId };
export const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
