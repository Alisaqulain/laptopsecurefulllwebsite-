"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErpPanel } from "@/components/erp/ErpPanel";

type Cat = { _id: string; name: string };
type Sup = { _id: string; name: string; phone?: string };

const LineSchema = z.object({
  categoryId: z.string().min(1, "Pick category"),
  productName: z.string().min(1, "Required"),
  brand: z.string().optional(),
  processor: z.string().optional(),
  ram: z.string().optional(),
  ssd: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(["new", "refurbished", "used"]).optional(),
  quantity: z.coerce.number().int().min(1),
  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  gstPercent: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

const FormSchema = z.object({
  supplierId: z.string().min(1, "Select supplier"),
  date: z.string().min(1),
  invoiceNumber: z.string().min(1, "Invoice # required"),
  lines: z.array(LineSchema).min(1, "Add at least one line"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const emptyLine = (): FormValues["lines"][number] => ({
  categoryId: "",
  productName: "",
  brand: "",
  processor: "",
  ram: "",
  ssd: "",
  color: "",
  condition: "used",
  quantity: 1,
  purchasePrice: 0,
  sellingPrice: 0,
  gstPercent: 18,
  notes: "",
});

export function PurchaseEntryForm({ onSaved }: { onSaved?: () => void }) {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [suppliers, setSuppliers] = useState<Sup[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as Resolver<FormValues>,
    defaultValues: {
      supplierId: "",
      date: new Date().toISOString().slice(0, 10),
      invoiceNumber: "",
      notes: "",
      lines: [emptyLine()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "lines" });

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

  const watched = form.watch("lines");
  const totals = useMemo(() => {
    let qty = 0;
    let sub = 0;
    let gst = 0;
    for (const l of watched) {
      const q = Number(l.quantity) || 0;
      const p = Number(l.purchasePrice) || 0;
      const g = Number(l.gstPercent) || 0;
      const lineSub = q * p;
      const lineGst = (lineSub * g) / 100;
      qty += q;
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
      toast.message("Select rows to remove");
      return;
    }
    for (const i of idxs) remove(i);
    setSelected({});
    toast.success("Removed selected rows");
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
            invoiceNumber: values.invoiceNumber,
            notes: values.notes || undefined,
            lines: values.lines.map((l) => ({
              categoryId: l.categoryId,
              productName: l.productName,
              brand: l.brand || undefined,
              processor: l.processor || undefined,
              ram: l.ram || undefined,
              ssd: l.ssd || undefined,
              color: l.color || undefined,
              condition: l.condition,
              quantity: l.quantity,
              purchasePrice: l.purchasePrice,
              sellingPrice: l.sellingPrice,
              gstPercent: l.gstPercent,
              notes: l.notes || undefined,
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
          supplierId: "",
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
                <option key={s._id} value={s._id}>
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
          <Field label="Supplier invoice # *">
            <Input {...form.register("invoiceNumber")} className="h-9" placeholder="Bill / DC number" />
            <FieldError msg={form.formState.errors.invoiceNumber?.message} />
          </Field>
          <Field label="Notes">
            <Input {...form.register("notes")} className="h-9" placeholder="Optional" />
          </Field>
        </div>
      </ErpPanel>

      <ErpPanel>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Line items</h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => append(emptyLine())}>
              <Plus className="mr-1 h-4 w-4" />
              Add row
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete selected
            </Button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[1200px] text-left text-xs">
            <thead className="bg-muted/80 text-[11px] font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="w-8 px-2 py-2">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Product</th>
                <th className="px-2 py-2">Brand</th>
                <th className="px-2 py-2">CPU</th>
                <th className="px-2 py-2">RAM</th>
                <th className="px-2 py-2">SSD/HDD</th>
                <th className="px-2 py-2">Color</th>
                <th className="px-2 py-2">Cond.</th>
                <th className="px-2 py-2">Qty</th>
                <th className="px-2 py-2">Buy</th>
                <th className="px-2 py-2">Sell</th>
                <th className="px-2 py-2">GST%</th>
                <th className="px-2 py-2">Notes</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-t border-border align-top">
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={!!selected[index]}
                      onChange={(e) => setSelected((s) => ({ ...s, [index]: e.target.checked }))}
                      className="mt-2"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <select
                      className="h-8 min-w-[120px] rounded-md border border-input bg-background px-1 text-xs"
                      disabled={metaLoading}
                      {...form.register(`lines.${index}.categoryId`)}
                    >
                      <option value="">—</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-1 py-1">
                    <Input {...form.register(`lines.${index}.productName`)} className="h-8 min-w-[120px]" />
                  </td>
                  <td className="px-1 py-1">
                    <Input {...form.register(`lines.${index}.brand`)} className="h-8 min-w-[72px]" />
                  </td>
                  <td className="px-1 py-1">
                    <Input {...form.register(`lines.${index}.processor`)} className="h-8 min-w-[88px]" />
                  </td>
                  <td className="px-1 py-1">
                    <Input {...form.register(`lines.${index}.ram`)} className="h-8 w-16" />
                  </td>
                  <td className="px-1 py-1">
                    <Input {...form.register(`lines.${index}.ssd`)} className="h-8 w-16" />
                  </td>
                  <td className="px-1 py-1">
                    <Input {...form.register(`lines.${index}.color`)} className="h-8 w-16" />
                  </td>
                  <td className="px-1 py-1">
                    <select
                      className="h-8 w-[88px] rounded-md border border-input bg-background px-1 text-xs"
                      {...form.register(`lines.${index}.condition`)}
                    >
                      <option value="new">New</option>
                      <option value="refurbished">Refurb</option>
                      <option value="used">Used</option>
                    </select>
                  </td>
                  <td className="px-1 py-1">
                    <Input type="number" {...form.register(`lines.${index}.quantity`)} className="h-8 w-14" />
                  </td>
                  <td className="px-1 py-1">
                    <Input type="number" {...form.register(`lines.${index}.purchasePrice`)} className="h-8 w-20" />
                  </td>
                  <td className="px-1 py-1">
                    <Input type="number" {...form.register(`lines.${index}.sellingPrice`)} className="h-8 w-20" />
                  </td>
                  <td className="px-1 py-1">
                    <Input type="number" {...form.register(`lines.${index}.gstPercent`)} className="h-8 w-14" />
                  </td>
                  <td className="px-1 py-1">
                    <Textarea {...form.register(`lines.${index}.notes`)} className="min-h-[32px] resize-y text-xs" rows={1} />
                  </td>
                  <td className="px-1 py-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
