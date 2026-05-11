import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";

/** Initial values when a purchase line switches to a category (commerce + checkbox defaults). */
export function defaultAttributesForFieldDefs(defs: CategoryFieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const d of defs) {
    if (d.type === "checkbox") {
      out[d.id] = false;
      continue;
    }
    if (d.type === "number") {
      if (d.id === "quantity") out[d.id] = 1;
      else if (d.id === "gstPercent") out[d.id] = 18;
      else if (d.id === "purchasePrice" || d.id === "sellingPrice") out[d.id] = 0;
    }
  }
  return out;
}
