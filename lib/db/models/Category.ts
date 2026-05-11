import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    imageUrl: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: [String], default: [] },
    },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

CategorySchema.index({ slug: 1 }, { unique: true });

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & { _id: mongoose.Types.ObjectId };
export const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);

