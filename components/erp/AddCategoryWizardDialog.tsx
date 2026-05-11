"use client";

import { useCallback, useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify, fieldKeyFromLabel } from "@/lib/inventory/productMatch";
import type { CategoryFieldDef, CategoryFieldType } from "@/lib/inventory/categoryFieldTypes";

const WIZARD_TYPES = ["text", "number", "select", "checkbox", "date", "textarea"] as const;
type WizardFieldType = (typeof WIZARD_TYPES)[number];

const TYPE_LABELS: Record<WizardFieldType, string> = {
  text: "Text line",
  number: "Number",
  select: "Dropdown choices",
  checkbox: "Yes / No box",
  date: "Date",
  textarea: "Long text",
};

function toStoredFieldType(t: WizardFieldType): CategoryFieldType {
  return t as CategoryFieldType;
}

type DraftField = {
  localKey: string;
  label: string;
  type: WizardFieldType;
  required: boolean;
  placeholder: string;
  optionsText: string;
};

function newDraftRow(): DraftField {
  return {
    localKey: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label: "",
    type: "text",
    required: false,
    placeholder: "",
    optionsText: "",
  };
}

function parseOptions(text: string): string[] {
  return text
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Stable ids from labels; resolves duplicates (e.g. two "Size" → size, size_2). */
function assignFieldIds(rows: { label: string }[]): string[] {
  const used = new Set<string>();
  return rows.map((r) => {
    const trimmed = r.label.trim();
    let base = trimmed ? fieldKeyFromLabel(trimmed) : `field`;
    if (!/^[a-zA-Z]/.test(base)) base = `f_${base}`;
    let id = base;
    let n = 2;
    while (used.has(id)) {
      id = `${base}_${n++}`;
    }
    used.add(id);
    return id.slice(0, 80);
  });
}

function draftsToDefinitions(rows: DraftField[]): CategoryFieldDef[] {
  const ids = assignFieldIds(rows);
  return rows.map((r, order) => ({
    id: ids[order]!,
    label: r.label.trim(),
    type: toStoredFieldType(r.type),
    required: r.required,
    placeholder: r.placeholder.trim() || undefined,
    options: r.type === "select" ? parseOptions(r.optionsText) : undefined,
    order,
    isMatchKey: order === 0,
  }));
}

export function AddCategoryWizardDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugUserEdited, setSlugUserEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [draftFields, setDraftFields] = useState<DraftField[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setSlug("");
    setSlugUserEdited(false);
    setDescription("");
    setDraftFields([]);
    setSaving(false);
  }, [open]);

  useEffect(() => {
    if (!open || slugUserEdited) return;
    setSlug(slugify(name));
  }, [name, slugUserEdited, open]);

  const updateRow = useCallback((index: number, patch: Partial<DraftField>) => {
    setDraftFields((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }, []);

  async function save() {
    const n = name.trim();
    if (n.length < 2) {
      toast.error("Category name must be at least 2 characters.");
      return;
    }
    const s = (slug.trim() || slugify(n)).toLowerCase();
    if (s.length < 2) {
      toast.error("Slug is too short.");
      return;
    }
    if (draftFields.length === 0) {
      toast.error("Add at least one question for this category.");
      return;
    }
    for (const r of draftFields) {
      if (!r.label.trim()) {
        toast.error("Each row needs a question name.");
        return;
      }
      if (r.type === "select" && r.required && !parseOptions(r.optionsText).length) {
        toast.error(`“${r.label.trim()}” is a dropdown — add at least one choice (comma or new line).`);
        return;
      }
    }

    const defs = draftsToDefinitions(draftFields);

    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: n,
        slug: s,
        description: description.trim() || undefined,
        status: "active",
        fieldDefinitions: defs,
        sortOrder: 100,
      }),
    });
    const json = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    setSaving(false);
    if (!res.ok) {
      toast.error(json?.error?.message || "Could not create category");
      return;
    }
    toast.success("Category created.");
    onCreated();
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-cat-title"
    >
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 id="add-cat-title" className="text-base font-semibold tracking-tight">
              New category
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Name the category, then list what staff should fill in on each purchase.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-5">
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Basics</h3>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor="ac-name">
                Category name
              </label>
              <Input id="ac-name" className="h-9" placeholder="e.g. Monitors" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor="ac-slug">
                Web address key (auto)
              </label>
              <Input
                id="ac-slug"
                className="h-9 font-mono text-sm"
                placeholder="monitors"
                value={slug}
                onChange={(e) => {
                  setSlugUserEdited(true);
                  setSlug(e.target.value.toLowerCase());
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor="ac-desc">
                Internal note (optional)
              </label>
              <Textarea
                id="ac-desc"
                rows={2}
                className="resize-y text-sm"
                placeholder="Only your team sees this."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">Purchase questions</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Put the most important question first — it is used to match the same product in stock.
              </p>
            </div>

            <Reorder.Group axis="y" values={draftFields} onReorder={setDraftFields} className="space-y-2.5">
              {draftFields.map((row, index) => (
                <Reorder.Item
                  key={row.localKey}
                  value={row}
                  className="rounded-lg border border-border bg-muted/15 p-3"
                >
                  <div className="flex gap-2">
                    <div className="flex shrink-0 flex-col items-center pt-1.5 text-muted-foreground" title="Drag to reorder">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">{index === 0 ? "First (stock match)" : `Question ${index + 1}`}</span>
                        {row.required ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">Must fill</span>
                        ) : null}
                      </div>
                      <Input
                        className="h-9 text-sm"
                        placeholder="e.g. Brand, Screen size, Serial number…"
                        value={row.label}
                        onChange={(e) => updateRow(index, { label: e.target.value })}
                        aria-label={`Question ${index + 1}`}
                      />
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <label className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[220px]">
                          <span className="text-[11px] text-muted-foreground">Answer type</span>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                            value={row.type}
                            onChange={(e) => updateRow(index, { type: e.target.value as WizardFieldType })}
                          >
                            {WIZARD_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {TYPE_LABELS[t]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 self-end pb-1 text-sm sm:self-center">
                          <input type="checkbox" checked={row.required} onChange={(e) => updateRow(index, { required: e.target.checked })} />
                          Must fill
                        </label>
                      </div>
                      {row.type === "select" ? (
                        <div>
                          <label className="mb-1 block text-[11px] text-muted-foreground">Choices (comma or one per line)</label>
                          <Textarea
                            rows={2}
                            className="text-sm"
                            placeholder={"One per line, e.g. 15 inch"}
                            value={row.optionsText}
                            onChange={(e) => updateRow(index, { optionsText: e.target.value })}
                          />
                        </div>
                      ) : null}
                      <div>
                        <label className="mb-1 block text-[11px] text-muted-foreground">Example hint on form (optional)</label>
                        <Input
                          className="h-8 text-sm"
                          placeholder="e.g. Dell, LG…"
                          value={row.placeholder}
                          onChange={(e) => updateRow(index, { placeholder: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive"
                      onClick={() => setDraftFields((p) => p.filter((_, i) => i !== index))}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => setDraftFields((p) => [...p, newDraftRow()])}>
              <Plus className="mr-1 h-4 w-4" />
              Add another question
            </Button>
          </section>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Create category"}
          </Button>
        </div>
      </div>
    </div>
  );
}
