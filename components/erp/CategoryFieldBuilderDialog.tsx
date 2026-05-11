"use client";

import { useCallback, useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CategoryFieldDef, CategoryFieldType } from "@/lib/inventory/categoryFieldTypes";
import { CATEGORY_FIELD_TYPES } from "@/lib/inventory/categoryFieldTypes";
type Cat = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  fieldDefinitions?: CategoryFieldDef[];
};

function newField(order: number): CategoryFieldDef {
  const id = `field_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return { id, label: "New field", type: "text", required: false, order, isMatchKey: false };
}

export function CategoryFieldBuilderDialog({
  category,
  open,
  onClose,
  onSaved,
}: {
  category: Cat | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<CategoryFieldDef[]>([]);

  const load = useCallback(async () => {
    if (!category) return;
    setLoading(true);
    const res = await fetch(`/api/categories/${category._id}`, { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as { data?: { category?: Cat } };
    const cat = res.ok ? json?.data?.category : null;
    const defs = (cat?.fieldDefinitions ?? []) as CategoryFieldDef[];
    setFields([...defs].sort((a, b) => a.order - b.order));
    setLoading(false);
  }, [category]);

  useEffect(() => {
    if (open && category) void load();
  }, [open, category, load]);

  async function save() {
    if (!category) return;
    setSaving(true);
    const ordered = fields.map((f, i) => ({ ...f, order: i }));
    const res = await fetch(`/api/categories/${category._id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fieldDefinitions: ordered }),
    });
    const json = (await res.json().catch(() => null)) as any;
    setSaving(false);
    if (!res.ok) {
      toast.error(json?.error?.message || "Save failed");
      return;
    }
    toast.success("Field schema saved");
    onSaved();
    onClose();
  }

  function updateField(index: number, patch: Partial<CategoryFieldDef>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  if (!open || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Dynamic fields · {category.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Define which inputs appear on purchase lines. Mark <strong>Match key</strong> for fields that identify the same stock row (e.g. model + RAM).
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading schema…</div>
          ) : (
            <div className="space-y-3">
              <Reorder.Group axis="y" values={fields} onReorder={setFields}>
                {fields.map((f, index) => (
                  <Reorder.Item
                    key={f.id}
                    value={f}
                    className="mb-3 rounded-lg border border-border bg-muted/20 p-3"
                  >
                    <div className="flex flex-wrap items-start gap-2">
                      <button
                        type="button"
                        className="mt-2 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
                        <div className="lg:col-span-2">
                          <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Label</div>
                          <Input
                            className="h-8 text-sm"
                            value={f.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                          />
                        </div>
                        <div>
                          <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Id (key)</div>
                          <Input
                            className="h-8 font-mono text-xs"
                            value={f.id}
                            onChange={(e) => updateField(index, { id: e.target.value.trim() })}
                          />
                        </div>
                        <div>
                          <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Type</div>
                          <select
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                            value={f.type}
                            onChange={(e) => updateField(index, { type: e.target.value as CategoryFieldType })}
                          >
                            {CATEGORY_FIELD_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 lg:col-span-2">
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={!!f.required} onChange={(e) => updateField(index, { required: e.target.checked })} />
                            Required
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={!!f.isMatchKey} onChange={(e) => updateField(index, { isMatchKey: e.target.checked })} />
                            Match key
                          </label>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Placeholder</div>
                          <Input
                            className="h-8 text-sm"
                            value={f.placeholder ?? ""}
                            onChange={(e) => updateField(index, { placeholder: e.target.value || undefined })}
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Options (select / dropdown)</div>
                          <Input
                            className="h-8 text-sm"
                            placeholder="Comma-separated"
                            value={(f.options ?? []).join(", ")}
                            onChange={(e) =>
                              updateField(index, {
                                options: e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => removeField(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={() => setFields((prev) => [...prev, newField(prev.length)])}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add field
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void save()} disabled={saving || loading}>
            {saving ? "Saving…" : "Save schema"}
          </Button>
        </div>
      </div>
    </div>
  );
}
