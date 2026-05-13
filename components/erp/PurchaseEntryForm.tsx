"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray, useWatch, type FieldPath, type Resolver, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";
import { DynamicCategoryFields } from "@/components/erp/DynamicCategoryFields";
import { defaultAttributesForFieldDefs } from "@/lib/inventory/defaultAttributesForFieldDefs";
import { extractCommerceFromAttributes } from "@/lib/inventory/purchaseCommerceAttributes";

type Cat = { _id: string; name: string; slug?: string; fieldDefinitions?: CategoryFieldDef[] };
type Sup = { _id: string; name: string; phone?: string };

const LineSchema = z.object({
  categoryId: z.string().min(1, "Pick category"),
  attributes: z.record(z.string(), z.unknown()).default({}),
});

const FormSchema = z.object({
  supplierId: z.string().min(1, "Select supplier"),
  date: z.string().min(1),
  invoiceNumber: z.string().max(80, "At most 80 characters").optional().default(""),
  lines: z.array(LineSchema).min(1, "Add at least one line"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;
type LineFieldKey = keyof FormValues["lines"][number];

function lineField(index: number, key: LineFieldKey): FieldPath<FormValues> {
  return `lines.${index}.${String(key)}` as FieldPath<FormValues>;
}

const emptyLine = (): FormValues["lines"][number] => ({
  categoryId: "",
  attributes: {},
});

export function PurchaseEntryForm({
  onSaved,
  initialSupplierId = "",
  onSupplierChange,
}: {
  onSaved?: () => void;
  initialSupplierId?: string;
  /** Keeps the purchases list below in sync with the supplier dropdown (single table, no duplicate panel). */
  onSupplierChange?: (supplierId: string) => void;
}) {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [suppliers, setSuppliers] = useState<Sup[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const initialSid = typeof initialSupplierId === "string" ? initialSupplierId.trim() : "";

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as Resolver<FormValues>,
    defaultValues: {
      supplierId: initialSid,
      date: new Date().toISOString().slice(0, 10),
      invoiceNumber: "",
      notes: "",
      lines: [emptyLine()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "lines" });

  const watchedSupplierId = useWatch({ control: form.control, name: "supplierId" }) ?? "";

  useEffect(() => {
    (async () => {
      setMetaLoading(true);
      const [cRes, sRes] = await Promise.all([
        fetch("/api/categories?all=1", { cache: "no-store" }),
        fetch("/api/suppliers", { cache: "no-store" }),
      ]);
      const cJson = (await cRes.json().catch(() => null)) as any;
      const sJson = (await sRes.json().catch(() => null)) as any;
      setCategories(cRes.ok ? cJson?.data?.categories ?? [] : []);
      setSuppliers(sRes.ok ? sJson?.data?.suppliers ?? [] : []);
      setMetaLoading(false);
    })();
  }, []);

  /** Native <select> has no matching <option> until suppliers load — browser can drop the value; re-apply after fetch. */
  useEffect(() => {
    if (metaLoading) return;
    const id = typeof initialSupplierId === "string" ? initialSupplierId.trim() : "";
    if (!id) return;
    const exists = suppliers.some((s) => String(s._id) === id);
    if (!exists) return;
    const cur = form.getValues("supplierId");
    if (cur !== id) {
      form.setValue("supplierId", id, { shouldDirty: false, shouldValidate: false });
    }
  }, [metaLoading, initialSupplierId, suppliers, form]);

  useEffect(() => {
    const id = typeof watchedSupplierId === "string" ? watchedSupplierId.trim() : "";
    onSupplierChange?.(id);
  }, [watchedSupplierId, onSupplierChange]);

  const watched = form.watch("lines");
  const totals = useMemo(() => {
    let qty = 0;
    let sub = 0;
    let gst = 0;
    for (const l of watched) {
      const a = (l.attributes ?? {}) as Record<string, unknown>;
      const c = extractCommerceFromAttributes(a);
      const lineSub = c.quantity * c.purchasePrice;
      const lineGst = (lineSub * c.gstPercent) / 100;
      qty += c.quantity;
      sub += lineSub;
      gst += lineGst;
    }
    return { qty, sub, gst, total: sub + gst };
  }, [watched]);

  const [selected, setSelected] = useState<Record<number, boolean>>({});

  function bulkDelete() {
    const idxs = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => Number(k))
      .sort((a, b) => b - a);
    if (idxs.length === 0) {
      toast.message("Select lines to remove");
      return;
    }
    for (const i of idxs) remove(i);
    setSelected({});
    toast.success("Removed selected lines");
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const res = await fetch("/api/purchases", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            supplierId: values.supplierId,
            date: values.date,
            invoiceNumber: (values.invoiceNumber ?? "").trim(),
            notes: values.notes || undefined,
            lines: values.lines.map((l) => ({
              categoryId: l.categoryId,
              attributes: l.attributes ?? {},
            })),
          }),
        });
        const json = (await res.json().catch(() => null)) as any;
        if (!res.ok) {
          toast.error(json?.error?.message || "Save failed");
          return;
        }
        toast.success("Purchase saved — stock updated.");
        form.reset({
          supplierId: (typeof initialSupplierId === "string" ? initialSupplierId.trim() : "") || "",
          date: new Date().toISOString().slice(0, 10),
          invoiceNumber: "",
          notes: "",
          lines: [emptyLine()],
        });
        setSelected({});
        onSaved?.();
      })}
    >
      <ErpPanel>
        <h2 className="text-sm font-semibold text-foreground">Supplier & bill</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Supplier *">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              disabled={metaLoading}
              {...form.register("supplierId")}
            >
              <option value="">Select…</option>
              {suppliers.map((s) => (
                <option key={String(s._id)} value={String(s._id)}>
                  {s.name}
                </option>
              ))}
            </select>
            <FieldError msg={form.formState.errors.supplierId?.message} />
          </Field>
          <Field label="Date *">
            <Input type="date" {...form.register("date")} className="h-9" />
            <FieldError msg={form.formState.errors.date?.message} />
          </Field>
          <Field label="Supplier invoice # (optional)">
            <Input {...form.register("invoiceNumber")} className="h-9" placeholder="Bill / DC number — leave blank if none" />
            <FieldError msg={form.formState.errors.invoiceNumber?.message} />
          </Field>
          <Field label="Notes">
            <Input {...form.register("notes")} className="h-9" placeholder="Optional" />
          </Field>
        </div>
      </ErpPanel>

      <ErpPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold">Line items</h2>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
              Choose a <strong>category</strong> — all line fields (including quantity and prices) come from that category&apos;s schema.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => append(emptyLine())}>
              <Plus className="mr-1 h-4 w-4" />
              Add line
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete selected
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <PurchaseLineCard
              key={field.id}
              index={index}
              categories={categories}
              metaLoading={metaLoading}
              selected={!!selected[index]}
              onSelectChange={(v) => setSelected((s) => ({ ...s, [index]: v }))}
              onRemove={() => remove(index)}
              form={form}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Qty total:</span>{" "}
            <span className="font-semibold tabular-nums">{totals.qty}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Subtotal:</span>{" "}
            <span className="font-semibold tabular-nums">₹{totals.sub.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">GST:</span>{" "}
            <span className="font-semibold tabular-nums">₹{totals.gst.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Grand total:</span>{" "}
            <span className="font-semibold tabular-nums text-primary">₹{totals.total.toFixed(2)}</span>
          </div>
        </div>

        {form.formState.errors.lines?.message ? (
          <p className="mt-2 text-sm text-destructive">{String(form.formState.errors.lines.message)}</p>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Save purchase</Button>
        </div>
      </ErpPanel>
    </form>
  );
}

function PurchaseLineCard({
  index,
  categories,
  metaLoading,
  selected,
  onSelectChange,
  onRemove,
  form,
}: {
  index: number;
  categories: Cat[];
  metaLoading: boolean;
  selected: boolean;
  onSelectChange: (v: boolean) => void;
  onRemove: () => void;
  form: UseFormReturn<FormValues>;
}) {
  const rawCatId = form.watch(lineField(index, "categoryId"));
  const catId = typeof rawCatId === "string" ? rawCatId : "";
  const cat = useMemo(() => categories.find((c) => c._id === catId), [categories, catId]);
  const defs = cat?.fieldDefinitions ?? [];

  const prevCatId = useRef<string>("");
  useEffect(() => {
    if (!catId) return;
    const d = categories.find((c) => c._id === catId)?.fieldDefinitions ?? [];
    if (!d.length) return;
    const switched = prevCatId.current !== catId;
    const cur = form.getValues(lineField(index, "attributes")) as Record<string, unknown> | undefined;
    const empty = !cur || Object.keys(cur).length === 0;
    if (switched || empty) {
      form.setValue(lineField(index, "attributes"), defaultAttributesForFieldDefs(d) as FormValues["lines"][number]["attributes"]);
    }
    prevCatId.current = catId;
  }, [catId, categories, form, index]);

  const attrs = (form.watch(lineField(index, "attributes")) as Record<string, unknown>) ?? {};

  function setAttr(id: string, value: unknown) {
    const next = { ...attrs, [id]: value };
    form.setValue(lineField(index, "attributes"), next, { shouldDirty: true });
  }

  const lineErrors = form.formState.errors.lines?.[index];
  const lineErrorText =
    lineErrors && typeof lineErrors === "object"
      ? Object.values(lineErrors)
          .map((e) => (typeof e === "object" && e && "message" in e ? String((e as { message?: string }).message) : ""))
          .filter(Boolean)
          .join(" · ")
      : "";

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <input type="checkbox" checked={selected} onChange={(e) => onSelectChange(e.target.checked)} className="mt-1" />
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">Category *</div>
            <select
              className="h-9 min-w-[220px] rounded-md border border-input bg-background px-2 text-sm"
              disabled={metaLoading}
              {...form.register(lineField(index, "categoryId"))}
            >
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                  {(c.fieldDefinitions?.length ?? 0) === 0 ? " (no fields)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onRemove} aria-label="Remove line">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        <DynamicCategoryFields definitions={defs} values={attrs} onChange={setAttr} disabled={!catId} />
      </div>

      {lineErrorText ? <p className="mt-2 text-xs text-destructive">{lineErrorText}</p> : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-destructive">{msg}</p>;
}
