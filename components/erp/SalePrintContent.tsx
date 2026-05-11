"use client";

import { useEffect, useState } from "react";
import { InvoiceBillDocument } from "@/components/erp/invoice/InvoiceBillDocument";
import { buildInvoicePrintBranding, type InvoicePrintBranding } from "@/lib/invoice/printBranding";

type Sale = {
  invoiceNumber: string;
  date: string;
  paymentMode?: string;
  notes?: string;
  customerSnapshot?: { name?: string; phone?: string; address?: string };
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
  const [branding, setBranding] = useState<InvoicePrintBranding>(() => buildInvoicePrintBranding(null));
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [saleRes, printRes] = await Promise.all([
        fetch(`/api/sales/${saleId}`, { cache: "no-store" }),
        fetch("/api/settings/print", { cache: "no-store" }),
      ]);
      const saleJson = (await saleRes.json().catch(() => null)) as any;
      if (!saleRes.ok) {
        if (!cancelled) setErr(saleJson?.error?.message || "Could not load sale");
        return;
      }
      if (!cancelled) setSale(saleJson?.data?.sale ?? null);

      if (printRes.ok) {
        const printJson = (await printRes.json().catch(() => null)) as any;
        const b = printJson?.data?.branding as InvoicePrintBranding | undefined;
        if (!cancelled && b) setBranding(b);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [saleId]);

  if (err) return <div className="p-8 text-sm text-destructive">{err}</div>;
  if (!sale) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;

  const rows = (sale.items ?? []).map((it, i) => ({
    sl: i + 1,
    description: it.name,
    qty: it.quantity,
    rate: it.sellingPrice,
    gstPercent: it.gstRate ?? 0,
    amount: it.lineTotal,
  }));

  return (
    <InvoiceBillDocument
      branding={branding}
      invoiceNumber={sale.invoiceNumber}
      invoiceDate={new Date(sale.date)}
      customer={{
        name: sale.customerSnapshot?.name ?? "—",
        phone: sale.customerSnapshot?.phone,
        address: sale.customerSnapshot?.address,
      }}
      paymentMode={sale.paymentMode}
      notes={sale.notes}
      rows={rows}
      totals={{
        subTotal: sale.totals?.subTotal ?? 0,
        discount: sale.totals?.discountTotal ?? 0,
        gst: sale.totals?.gstTotal ?? 0,
        final: sale.totals?.finalTotal ?? 0,
      }}
    />
  );
}
