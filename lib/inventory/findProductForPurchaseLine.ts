import type { ClientSession, Types } from "mongoose";
import { ProductModel } from "@/lib/db/models/Product";
import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";
import { stringifyMatchValue } from "@/lib/inventory/validateCategoryAttributes";

export type CategoryLean = {
  _id: Types.ObjectId;
  slug?: string;
  fieldDefinitions?: CategoryFieldDef[];
};

export type PurchaseLinePayload = {
  productName: string;
  attributes: Record<string, unknown>;
};

function buildAttributeMatch(categoryId: Types.ObjectId, definitions: CategoryFieldDef[], attributes: Record<string, unknown>) {
  const q: Record<string, unknown> = { categoryId };
  for (const def of definitions) {
    if (!def.isMatchKey) continue;
    const v = stringifyMatchValue(attributes[def.id]);
    if (v === "" && !def.required) continue;
    q[`attributes.${def.id}`] = v;
  }
  return q;
}

/** Legacy laptop rows stored flat specs (no `attributes`). */
function buildLegacyLaptopMatch(
  categoryId: Types.ObjectId,
  productName: string,
  attributes: Record<string, unknown>,
  categorySlug?: string,
) {
  if (categorySlug !== "laptop") return null;
  const brand = stringifyMatchValue(attributes.brand);
  const processor = stringifyMatchValue(attributes.processor);
  const ram = stringifyMatchValue(attributes.ram);
  const storage = stringifyMatchValue(attributes.ssdHdd);
  const graphics = stringifyMatchValue(attributes.gpu);
  const color = stringifyMatchValue(attributes.color);
  const condition = stringifyMatchValue(attributes.condition) || "used";
  return {
    categoryId,
    name: productName.trim(),
    brand,
    processor,
    ram,
    storage,
    graphics,
    color,
    condition,
    $or: [{ attributes: { $exists: false } }, { attributes: null }, { attributes: { $eq: {} } }],
  };
}

export async function findProductForPurchaseLine(
  category: CategoryLean,
  line: PurchaseLinePayload,
  session: ClientSession,
) {
  const categoryId = category._id;
  const defs = category.fieldDefinitions ?? [];
  const attrs = line.attributes ?? {};

  if (defs.length > 0) {
    const typed = buildAttributeMatch(categoryId, defs, attrs);
    const product = await ProductModel.findOne(typed).session(session);
    if (product) return { product, legacy: false as const };
  }

  const legacy = buildLegacyLaptopMatch(categoryId, line.productName, attrs, category.slug);
  if (legacy) {
    const product = await ProductModel.findOne(legacy).session(session);
    if (product) return { product, legacy: true as const };
  }

  return { product: null, legacy: false as const };
}
