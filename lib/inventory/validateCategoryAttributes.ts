import type { CategoryFieldDef, CategoryFieldType } from "@/lib/inventory/categoryFieldTypes";

function isEmpty(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

function coerceValue(raw: unknown, type: CategoryFieldType): unknown {
  if (raw === undefined || raw === null) return type === "checkbox" ? false : "";
  if (type === "checkbox") {
    if (typeof raw === "boolean") return raw;
    if (raw === "true" || raw === true || raw === "on" || raw === "1") return true;
    return false;
  }
  if (type === "number") {
    const n = typeof raw === "number" ? raw : Number(String(raw).trim());
    return Number.isFinite(n) ? n : NaN;
  }
  if (type === "date") {
    const s = String(raw).trim();
    return s;
  }
  return typeof raw === "string" ? raw.trim() : String(raw);
}

export type AttributeValidationResult = {
  ok: boolean;
  normalized: Record<string, unknown>;
  errors: string[];
};

/** Validates and normalizes `attributes` against a category's `fieldDefinitions`. */
export function validateCategoryAttributes(
  definitions: CategoryFieldDef[] | undefined,
  attributes: Record<string, unknown> | undefined,
): AttributeValidationResult {
  const defs = [...(definitions ?? [])].sort((a, b) => a.order - b.order);
  const raw = attributes ?? {};
  const normalized: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const def of defs) {
    const rawVal = raw[def.id];
    const coerced = coerceValue(rawVal, def.type);

    if (def.required && (def.type === "number" ? !Number.isFinite(coerced as number) || isEmpty(coerced) : isEmpty(coerced))) {
      errors.push(`${def.label} is required`);
      continue;
    }

    if (!def.required && (rawVal === undefined || rawVal === null || rawVal === "")) {
      if (def.type === "checkbox") normalized[def.id] = false;
      else if (def.type === "number") normalized[def.id] = Number.isFinite(coerced as number) ? coerced : undefined;
      else normalized[def.id] = undefined;
      continue;
    }

    if (def.type === "number" && def.required && !Number.isFinite(coerced as number)) {
      errors.push(`${def.label} must be a valid number`);
      continue;
    }

    if ((def.type === "select" || def.type === "dropdown") && def.options?.length) {
      const s = String(coerced);
      if (s && !def.options.includes(s)) {
        errors.push(`${def.label} must be one of: ${def.options.join(", ")}`);
        continue;
      }
    }

    normalized[def.id] = coerced;
  }

  return { ok: errors.length === 0, normalized, errors };
}

export function stringifyMatchValue(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "";
  return String(v).trim();
}

/** Drops empty strings / nullish so Mongo attribute keys stay consistent for matching. */
export function compactAttributes(attrs: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}
