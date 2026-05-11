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
import { formatPrice } from "@/lib/utils";

type ProductRow = {
  _id: string;
  name: string;
  sku: string;
  images?: string[];
  pricing?: { sellingPrice: number; gstRate?: number };
  stock?: { onHand: number };
};

const Schema = z.object({
  customerName: z.string().min(1, "Customer name required"),
  customerPhone: z.string().min(6, "Phone required"),
  productId: z.string().min(1, "Select a product"),
  quantity: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).optional(),
  gstPercent: z.coerce.number().min(0).max(100).optional(),
  paymentMode: z.enum(["cash", "upi", "card", "bank_transfer"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export function SalesEntryForm() {
  const pathname = usePathname();
  const sampleInvoiceHref = pathname.startsWith("/sales") ? "/sales/print/sample" : "/erp/invoices/print/sample";
  const printSaleBase = pathname.startsWith("/sales") ? "/sales/print/sale" : "/erp/print/sale";
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
      notes: "",
    },
  });

  const productId = form.watch("productId");
  const qty = form.watch("quantity");
  const price = form.watch("price");
  const discount = form.watch("discount") ?? 0;
  const gstPercent = form.watch("gstPercent") ?? 0;

  const selected = products.find((p) => p._id === productId);
  const lineSub = Math.max(0, qty * price - discount);
  const gstAmt = (lineSub * gstPercent) / 100;
  const total = lineSub + gstAmt;

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

  useEffect(() => {
    if (!productId) return;
    const p = products.find((x) => x._id === productId);
    if (!p?.pricing) return;
    form.setValue("price", p.pricing.sellingPrice ?? 0);
    if (p.pricing.gstRate != null) form.setValue("gstPercent", p.pricing.gstRate);
  }, [productId, products, form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
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
              notes: values.notes || undefined,
            }),
          });
          const json = (await res.json().catch(() => null)) as any;
          if (!res.ok) {
            toast.error(json?.error?.message || "Sale failed");
            return;
          }
          const id = json?.data?.sale?._id as string | undefined;
          toast.success("Sale saved — stock updated.");
          if (id) window.open(`${printSaleBase}/${id}`, "_blank", "noopener,noreferrer");
          form.reset({
            customerName: "",
            customerPhone: "",
            productId: "",
            quantity: 1,
            price: 0,
            discount: 0,
            gstPercent: 18,
            paymentMode: "cash",
            notes: "",
          });
          setQ("");
        } finally {
          setSubmitting(false);
        }
      })}
    >
      <div className="grid gap-4 lg:grid-cols-3">
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

          <div className="mt-3 max-h-56 overflow-y-auto rounded-md border border-border">
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
                    <th className="px-3 py-2 text-right">MRP / list</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t border-border hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <input
                          type="radio"
                          value={p._id}
                          checked={productId === p._id}
                          onChange={() => form.setValue("productId", p._id)}
                        />
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.stock?.onHand ?? 0}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatPrice(p.pricing?.sellingPrice ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Err text={form.formState.errors.productId?.message} />

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">Qty *</div>
              <Input type="number" className="h-9" {...form.register("quantity")} />
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">Price *</div>
              <Input type="number" className="h-9" {...form.register("price")} />
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">Discount</div>
              <Input type="number" className="h-9" {...form.register("discount")} />
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">GST %</div>
              <Input type="number" className="h-9" {...form.register("gstPercent")} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-4 border-t border-border pt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Taxable:</span>{" "}
              <span className="font-medium tabular-nums">{formatPrice(lineSub)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">GST:</span>{" "}
              <span className="font-medium tabular-nums">{formatPrice(gstAmt)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="text-lg font-semibold tabular-nums text-primary">{formatPrice(total)}</span>
            </div>
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
  );
}

function Err({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs text-destructive">{text}</p>;
}
