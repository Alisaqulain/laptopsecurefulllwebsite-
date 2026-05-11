/** Build invoice / product display name from category slug + dynamic attributes (no separate productName field on the line). */
export function deriveProductNameFromAttributes(categorySlug: string | undefined, attrs: Record<string, unknown>): string {
  const slug = (categorySlug ?? "").replace(/^demo-/, "");

  if (slug === "laptop") {
    const n = [attrs.brand, attrs.laptopModel].filter((x) => x != null && String(x).trim() !== "").join(" ").trim();
    return n || "Laptop";
  }

  if (slug === "desktop-pc") {
    const n = [attrs.brand, attrs.cabinet].filter((x) => x != null && String(x).trim() !== "").join(" ").trim();
    if (n) return n.slice(0, 200);
    const p = attrs.processor != null ? String(attrs.processor).trim() : "";
    return p ? `Desktop · ${p.slice(0, 100)}` : "Desktop PC";
  }

  if (slug === "accessories") {
    const n = attrs.accessoryName != null ? String(attrs.accessoryName).trim() : "";
    if (n) return n.slice(0, 200);
    const m = attrs.model != null ? String(attrs.model).trim() : "";
    return m ? `Accessory · ${m.slice(0, 120)}` : "Accessory";
  }

  if (slug === "parts") {
    const n = attrs.partName != null ? String(attrs.partName).trim() : "";
    return n ? n.slice(0, 200) : "Part";
  }

  const generic = attrs.productTitle ?? attrs.name ?? attrs.title ?? attrs.partName ?? attrs.accessoryName;
  if (generic != null && String(generic).trim()) return String(generic).trim().slice(0, 200);

  return "Product";
}
