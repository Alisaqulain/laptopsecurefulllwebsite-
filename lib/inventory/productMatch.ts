import type { Types } from "mongoose";

export type LineSpecs = {
  productName: string;
  brand?: string;
  processor?: string;
  ram?: string;
  ssd?: string;
  color?: string;
  condition?: string;
};

export function productSpecMatch(categoryId: Types.ObjectId, line: LineSpecs) {
  return {
    categoryId,
    name: line.productName.trim(),
    brand: (line.brand ?? "").trim(),
    processor: (line.processor ?? "").trim(),
    ram: (line.ram ?? "").trim(),
    storage: (line.ssd ?? "").trim(),
    color: (line.color ?? "").trim(),
    condition: (line.condition === "new" || line.condition === "refurbished" ? line.condition : "used") as
      | "new"
      | "refurbished"
      | "used",
  };
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
