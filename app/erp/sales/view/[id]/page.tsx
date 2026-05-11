"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { PageHeader } from "@/components/erp/PageHeader";
import { formatDate, formatPrice } from "@/lib/utils";

type Sale = {
  invoiceNumber: string;
  date: string;
  paymentMode?: string;
  customerSnapshot?: { name?: string; phone?: string; address?: string };
  items?: Array<{
    name: string;
    quantity: number;
    sellingPrice: number;
    gstRate?: number;
    lineTotal: number;
  }>;
  totals?: { subTotal?: number; discountTotal?: number; gstTotal?: number; finalTotal?: number };
  notes?: string;
};

export default function ErpSaleViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sale, setSale] = useState<Sale | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/sales/${id}`, { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as { data?: { sale?: Sale }; error?: { message?: string } };
      if (!res.ok) {
        setErr(json?.error?.message || "Could not load sale");
        return;
      }
      setSale(json?.data?.sale ?? null);
    })();
  }, [id]);

  return (
    <>
      <PageHeader
        title="Sale detail"
        description="Read-only record. Use Download for a printable invoice (save as PDF from the browser)."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href="/erp/sales">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sales
              </Link>
            </Button>
            <Button type="button" size="sm" asChild>
              <a href={`/erp/print/sale/${id}`} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download / print
              </a>
            </Button>
          </div>
        }
      />

      {err ? (
        <ErpPanel>
          <p className="text-sm text-destructive">{err}</p>
        </ErpPanel>
      ) : !sale ? (
        <ErpPanel>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </ErpPanel>
      ) : (
        <ErpPanel>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Invoice</div>
              <div className="mt-1 font-mono text-lg font-semibold">{sale.invoiceNumber}</div>
              <div className="mt-3 text-xs font-medium uppercase text-muted-foreground">Date</div>
              <div className="mt-1">{formatDate(sale.date)}</div>
              <div className="mt-3 text-xs font-medium uppercase text-muted-foreground">Payment</div>
              <div className="mt-1 capitalize">{sale.paymentMode?.replace("_", " ") ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Customer</div>
              <div className="mt-1 font-medium">{sale.customerSnapshot?.name ?? "—"}</div>
              <div className="mt-1 text-sm text-muted-foreground">{sale.customerSnapshot?.phone ?? ""}</div>
              {sale.customerSnapshot?.address ? (
                <div className="mt-2 text-sm text-muted-foreground">{sale.customerSnapshot.address}</div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                  <th className="px-3 py-2 text-right font-medium">GST %</th>
                  <th className="px-3 py-2 text-right font-medium">Line total</th>
                </tr>
              </thead>
              <tbody>
                {(sale.items ?? []).map((it, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2">{it.name}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{it.quantity}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatPrice(it.sellingPrice)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{it.gstRate ?? 0}%</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">{formatPrice(it.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-6 border-t border-border pt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Subtotal:</span>{" "}
              <span className="font-semibold tabular-nums">{formatPrice(sale.totals?.subTotal ?? 0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Discount:</span>{" "}
              <span className="font-semibold tabular-nums">{formatPrice(sale.totals?.discountTotal ?? 0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">GST:</span>{" "}
              <span className="font-semibold tabular-nums">{formatPrice(sale.totals?.gstTotal ?? 0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="text-lg font-semibold tabular-nums text-primary">{formatPrice(sale.totals?.finalTotal ?? 0)}</span>
            </div>
          </div>

          {sale.notes ? (
            <div className="mt-4 rounded-md border border-dashed border-border bg-muted/20 p-3 text-sm">
              <span className="text-xs font-medium uppercase text-muted-foreground">Notes</span>
              <p className="mt-1 text-muted-foreground">{sale.notes}</p>
            </div>
          ) : null}
        </ErpPanel>
      )}
    </>
  );
}
