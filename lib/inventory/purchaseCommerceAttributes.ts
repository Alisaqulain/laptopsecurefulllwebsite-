/** Line-level commerce keys stored inside `attributes` on the purchase form (mirrored in category schema). */
export const PURCHASE_COMMERCE_FIELD_IDS = [
  "quantity",
  "purchasePrice",
  "sellingPrice",
  "gstPercent",
  "notes",
  "purchaseDate",
] as const;

export type PurchaseCommerceFieldId = (typeof PURCHASE_COMMERCE_FIELD_IDS)[number];

const COMMERCE_SET = new Set<string>(PURCHASE_COMMERCE_FIELD_IDS);

export function isCommerceFieldId(id: string): boolean {
  return COMMERCE_SET.has(id);
}

/** Strip commerce keys — used for `Product.attributes` (inventory specs only). */
export function specAttributesOnly(full: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...full };
  for (const id of PURCHASE_COMMERCE_FIELD_IDS) {
    delete out[id];
  }
  return out;
}

export function extractCommerceFromAttributes(attrs: Record<string, unknown>) {
  return {
    quantity: Math.max(1, Math.floor(Number(attrs.quantity) || 1)),
    purchasePrice: Math.max(0, Number(attrs.purchasePrice) || 0),
    sellingPrice: Math.max(0, Number(attrs.sellingPrice) || 0),
    gstPercent: Math.min(100, Math.max(0, Number(attrs.gstPercent) || 0)),
    notes: typeof attrs.notes === "string" ? attrs.notes.trim() : attrs.notes != null ? String(attrs.notes).trim() : "",
  };
}
