/** Admin-configurable field kinds for ERP categories (drives purchase + product shape). */
export const CATEGORY_FIELD_TYPES = ["text", "number", "dropdown", "select", "checkbox", "date", "textarea"] as const;
export type CategoryFieldType = (typeof CATEGORY_FIELD_TYPES)[number];

export type CategoryFieldDef = {
  /** Stable key stored under `Product.attributes[id]` */
  id: string;
  label: string;
  type: CategoryFieldType;
  required?: boolean;
  placeholder?: string;
  /** For `select` / `dropdown` */
  options?: string[];
  order: number;
  /** When true, this attribute must match to merge stock on the same product row */
  isMatchKey?: boolean;
};

export function isCategoryFieldType(v: string): v is CategoryFieldType {
  return (CATEGORY_FIELD_TYPES as readonly string[]).includes(v);
}
