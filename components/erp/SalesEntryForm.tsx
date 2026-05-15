"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { SalesListTable } from "@/components/erp/SalesListTable";
import { formatPrice } from "@/lib/utils";

type ProductRow = {
  _id: string;
  name: string;
  sku: string;
  pricing?: { sellingPrice?: number; gstRate?: number };
  stock?: { onHand: number };
};

const Schema = z.object({
  customerName: z.string().min(1, "Customer name required"),
  customerPhone: z.string().min(6, "Phone required"),
  productId: z.string().min(1, "Select a product"),
  quantity: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0, "Enter selling amount"),
  discount: z.coerce.number().min(0).optional(),
  gstPercent: z.coerce.number().min(0).max(100).optional(),
  paymentMode: z.enum(["cash", "upi", "card", "bank_transfer"]),
  amountReceived: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export function SalesEntryForm({ salesPortal: salesPortalProp }: { salesPortal?: boolean } = {}) {
  const [salesListKey, setSalesListKey] = useState(0);
  const pathname = usePathname();
  const isSalesPortal = salesPortalProp ?? pathname.startsWith("/sales");
  const sampleInvoiceHref = isSalesPortal ? "/sales/print/sample" : "/erp/invoices/print/sample";
  const printSaleBase = isSalesPortal ? "/sales/print/sale" : "/erp/print/sale";

  const [q, setQ] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema) as Resolver<FormValues>,
    defaultValues: {
      customerName: "",
      customerPhone: "",
      productId: "",
      quantity: 1,
      price: 0,
      discount: 0,
      gstPercent: 18,
      paymentMode: "cash",
      amountReceived: undefined as unknown as number,
      notes: "",
    },
  });

  const productId = form.watch("productId");
  const qty = form.watch("quantity");
  const price = form.watch("price");
  const discount = form.watch("discount") ?? 0;
  const gstPercent = form.watch("gstPercent") ?? 0;

  const selected = products.find((p) => p._id === productId);
  /** Suggested price shown as a hint — sales staff can override freely. */
  const suggestedPrice = selected?.pricing?.sellingPrice ?? null;

  const lineBase = qty * price;
  const lineSub = Math.max(0, lineBase - discount);
  const gstAmt = (lineSub * gstPercent) / 100;
  const grandTotal = lineSub + gstAmt;
  const amountReceivedRaw = form.watch("amountReceived");
  const amountReceived =
    amountReceivedRaw === undefined || amountReceivedRaw === null || Number.isNaN(Number(amountReceivedRaw))
      ? grandTotal
      : Number(amountReceivedRaw);
  const udhariDue = Math.max(0, grandTotal - amountReceived);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const url = new URL("/api/products", window.location.origin);
      if (q.trim()) url.searchParams.set("q", q.trim());
      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      setProducts(res.ok ? json?.data?.products ?? [] : []);
      setLoading(false);
    })();
  }, [q]);

  /** When a product is selected, pre-fill GST % from its profile (staff can change it).
   *  We intentionally do NOT pre-fill the price so the staff must consciously type the selling amount. */
  useEffect(() => {
    if (!productId) return;
    const p = products.find((x) => x._id === productId);
    if (!p?.pricing) return;
    if (p.pricing.gstRate != null) form.setValue("gstPercent", p.pricing.gstRate);
  }, [productId, products, form]);

  function resetForm() {
    form.reset({
      customerName: "",
      customerPhone: "",
      productId: "",
      quantity: 1,
      price: 0,
      discount: 0,
      gstPercent: 18,
      paymentMode: "cash",
      amountReceived: undefined as unknown as number,
      notes: "",
    });
    setQ("");
  }

  return (
    <>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          const received =
            values.amountReceived != null && !Number.isNaN(Number(values.amountReceived))
              ? Number(values.amountReceived)
              : grandTotal;
          if (received > grandTotal + 0.009) {
            toast.error("Amount received cannot be more than bill total");
            return;
          }
          const dueOnSubmit = Math.max(0, grandTotal - received);
          setSubmitting(true);
          try {
            const res = await fetch("/api/sales", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                customerName: values.customerName,
                customerPhone: values.customerPhone,
                productId: values.productId,
                quantity: values.quantity,
                price: values.price,
                discount: values.discount ?? 0,
                gstPercent: values.gstPercent ?? 0,
                paymentMode: values.paymentMode,
                amountReceived:
                  values.amountReceived != null && !Number.isNaN(Number(values.amountReceived))
                    ? Number(values.amountReceived)
                    : undefined,
                notes: values.notes || undefined,
              }),
            });
            const json = (await res.json().catch(() => null)) as any;
            if (!res.ok) {
              toast.error(json?.error?.message || "Sale failed");
              return;
            }
            const id = json?.data?.sale?._id as string | undefined;
            toast.success(
              dueOnSubmit > 0
                ? `Sale saved — ${formatPrice(dueOnSubmit)} on udhari`
                : "Sale saved — stock updated.",
            );
            setSalesListKey((k) => k + 1);
            if (id) window.open(`${printSaleBase}/${id}`, "_blank", "noopener,noreferrer");
            resetForm();
          } finally {
            setSubmitting(false);
          }
        })}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {/* ── Customer panel ─────────────────────────────────── */}
          <ErpPanel className="lg:col-span-1">
            <h2 className="text-sm font-semibold">Customer</h2>
            <div className="mt-3 space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Name *</div>
                <Input className="h-9" {...form.register("customerName")} />
                <Err text={form.formState.errors.customerName?.message} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Phone *</div>
                <Input className="h-9" {...form.register("customerPhone")} />
                <Err text={form.formState.errors.customerPhone?.message} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Payment *</div>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  {...form.register("paymentMode")}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank transfer</option>
                </select>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Notes</div>
                <Textarea rows={3} className="text-sm" {...form.register("notes")} />
              </div>
            </div>
          </ErpPanel>

          {/* ── Product + billing panel ─────────────────────────── */}
          <ErpPanel className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-sm font-semibold">Product</h2>
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-9 pl-8"
                  placeholder="Search SKU / model…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Product table */}
            <div className="mt-3 max-h-52 overflow-y-auto rounded-md border border-border">
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading…</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-muted/90 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2" />
                      <th className="px-3 py-2">SKU</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2 text-right">Stock</th>
                      <th className="px-3 py-2 text-right">Suggested ₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr
                        key={p._id}
                        className={`border-t border-border hover:bg-muted/40 ${productId === p._id ? "bg-primary/10" : ""}`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="radio"
                            value={p._id}
                            checked={productId === p._id}
                            onChange={() => form.setValue("productId", p._id)}
                          />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                        <td className="px-3 py-2 font-medium">{p.name}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.stock?.onHand ?? 0}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                          {p.pricing?.sellingPrice ? formatPrice(p.pricing.sellingPrice) : "—"}
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                          No products found. Try searching.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <Err text={form.formState.errors.productId?.message} />

            {/* Suggested price hint when product selected */}
            {selected && suggestedPrice != null && (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                <span>Suggested price:</span>
                <span className="font-semibold text-foreground tabular-nums">{formatPrice(suggestedPrice)}</span>
                <span className="text-muted-foreground/60">— you can enter a different amount below</span>
              </div>
            )}

            {/* Billing grid — always shown for both ERP and sales portal */}
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Qty *</div>
                <Input type="number" min={1} className="h-9" {...form.register("quantity")} />
                <Err text={form.formState.errors.quantity?.message} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Selling amount ₹ *</div>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Enter amount"
                  className="h-9"
                  {...form.register("price")}
                />
                <Err text={form.formState.errors.price?.message} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Discount ₹</div>
                <Input type="number" min={0} step="0.01" className="h-9" {...form.register("discount")} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">GST %</div>
                <Input type="number" min={0} max={100} step="0.01" className="h-9" {...form.register("gstPercent")} />
              </div>
            </div>

            {/* Live bill summary */}
            <div className="mt-4 rounded-lg border border-border bg-muted/10 px-4 py-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
                <div>
                  <div className="text-xs text-muted-foreground">Subtotal</div>
                  <div className="font-medium tabular-nums">{formatPrice(lineBase)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Discount</div>
                  <div className="font-medium tabular-nums text-destructive">−{formatPrice(discount)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">GST ({gstPercent}%)</div>
                  <div className="font-medium tabular-nums">+{formatPrice(gstAmt)}</div>
                </div>
                <div className="rounded-md bg-primary/10 px-2 py-1">
                  <div className="text-xs font-medium text-primary">Grand total</div>
                  <div className="text-base font-bold tabular-nums text-primary">{formatPrice(grandTotal)}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Amount received now ₹</div>
                <Input type="number" min={0} step="0.01" className="h-9" {...form.register("amountReceived")} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Full bill total = paid in full. Enter less to put the rest on udhari.
                </p>
              </div>
              {udhariDue > 0.009 && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2">
                  <div className="text-xs font-medium text-amber-800 dark:text-amber-300">Udhari (credit due)</div>
                  <div className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-400">
                    {formatPrice(udhariDue)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Received {formatPrice(amountReceived)} of {formatPrice(grandTotal)}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save sale & print"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href={sampleInvoiceHref} target="_blank" rel="noreferrer">
                  Sample A4 layout
                </a>
              </Button>
            </div>
          </ErpPanel>
        </div>
      </form>

      {/* Recent sales below the form on both portals */}
      <div className="mt-8">
        <SalesListTable
          refreshKey={salesListKey}
          mode={isSalesPortal ? "sales" : "erp"}
        />
      </div>
    </>
  );
}

function Err({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs text-destructive">{text}</p>;
}
