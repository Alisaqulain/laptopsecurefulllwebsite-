"use client";

import type { CategoryFieldDef, CategoryFieldType } from "@/lib/inventory/categoryFieldTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  definitions: CategoryFieldDef[];
  values: Record<string, unknown>;
  onChange: (fieldId: string, value: unknown) => void;
  disabled?: boolean;
};

function renderInput(def: CategoryFieldDef, raw: unknown, onChange: (v: unknown) => void, disabled?: boolean) {
  const t: CategoryFieldType = def.type;
  const ph = def.placeholder ?? "";

  if (t === "textarea") {
    return (
      <Textarea
        disabled={disabled}
        rows={2}
        className="text-sm"
        placeholder={ph}
        value={raw != null ? String(raw) : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (t === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" disabled={disabled} checked={Boolean(raw)} onChange={(e) => onChange(e.target.checked)} />
        <span>Yes</span>
      </label>
    );
  }

  if (t === "number") {
    return (
      <Input
        type="number"
        disabled={disabled}
        className="h-9"
        placeholder={ph}
        value={raw === undefined || raw === null ? "" : String(raw)}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    );
  }

  if (t === "date") {
    return (
      <Input
        type="date"
        disabled={disabled}
        className="h-9"
        value={raw != null ? String(raw).slice(0, 10) : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (t === "select" || t === "dropdown") {
    const opts = def.options ?? [];
    return (
      <select
        disabled={disabled}
        className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        value={raw != null ? String(raw) : ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{def.required ? "—" : "Optional"}</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      disabled={disabled}
      className="h-9"
      placeholder={ph}
      value={raw != null ? String(raw) : ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function DynamicCategoryFields({ definitions, values, onChange, disabled }: Props) {
  const sorted = [...definitions].sort((a, b) => a.order - b.order);
  if (sorted.length === 0) {
    return <p className="text-xs text-muted-foreground">This category has no custom fields yet. Configure it under Categories.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((def) => (
        <div key={def.id}>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {def.label}
            {def.required ? <span className="text-destructive"> *</span> : null}
          </div>
          {renderInput(def, values[def.id], (v) => onChange(def.id, v), disabled)}
        </div>
      ))}
    </div>
  );
}
