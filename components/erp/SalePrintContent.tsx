"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

type Sale = {
  invoiceNumber: string;
  date: string;
  paymentMode?: string;
  customerSnapshot?: { name?: string; phone?: string };
  items?: Array<{
    name: string;
    quantity: number;
    sellingPrice: number;
    gstRate?: number;
    lineTotal: number;
  }>;
  totals?: { subTotal?: number; discountTotal?: number; gstTotal?: number; finalTotal?: number };
};

export function SalePrintContent({ saleId }: { saleId: string }) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/sales/${saleId}`, { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setErr(json?.error?.message || "Could not load sale");
        return;
      }
      setSale(json?.data?.sale ?? null);
    })();
  }, [saleId]);

  if (err) return <div className="p-8 text-sm text-destructive">{err}</div>;
  if (!sale) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;

  const item = sale.items?.[0];

  return (
    <div className="min-h-screen bg-white p-8 text-slate-900 print:p-6">
      <style>{`@media print { @page { size: A4; margin: 14mm; } }`}</style>
      <div className="mx-auto max-w-2xl border border-slate-200 p-6">
        <div className="flex justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-lg font-bold">{siteConfig.name}</div>
            <div className="mt-1 text-xs text-slate-600">{siteConfig.contact.address}</div>
          </div>
          <div className="text-right text-xs">
            <div className="font-semibold">SALES INVOICE</div>
            <div className="mt-2 text-slate-600">No.</div>
            <div className="font-mono text-sm">{sale.invoiceNumber}</div>
            <div className="mt-2 text-slate-600">Date</div>
            <div>{new Date(sale.date).toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        <div className="mt-4 border-b border-slate-200 pb-4 text-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Customer</div>
          <div className="mt-1 font-medium">{sale.customerSnapshot?.name ?? "—"}</div>
          <div className="text-xs text-slate-600">{sale.customerSnapshot?.phone ?? ""}</div>
          <div className="mt-2 text-xs text-slate-600">Payment: {sale.paymentMode ?? "—"}</div>
        </div>

        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">GST%</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {item ? (
              <tr className="border-b border-slate-100">
                <td className="py-3">{item.name}</td>
                <td className="py-3 text-right tabular-nums">{item.quantity}</td>
                <td className="py-3 text-right tabular-nums">{formatPrice(item.sellingPrice)}</td>
                <td className="py-3 text-right tabular-nums">{item.gstRate ?? 0}%</td>
                <td className="py-3 text-right tabular-nums font-medium">{formatPrice(item.lineTotal)}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-slate-500">
                  No line items
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end text-sm">
          <div className="w-56 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Taxable</span>
              <span className="tabular-nums">{formatPrice(sale.totals?.subTotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount</span>
              <span className="tabular-nums">{formatPrice(sale.totals?.discountTotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST</span>
              <span className="tabular-nums">{formatPrice(sale.totals?.gstTotal ?? 0)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(sale.totals?.finalTotal ?? 0)}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-4 text-right text-xs text-slate-500">
          <div>For {siteConfig.name}</div>
          <div className="mt-10 border-t border-slate-300 pt-2 text-slate-600">Authorized signatory</div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-2xl justify-end print:hidden">
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  );
}
