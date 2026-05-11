"use client";

import { useEffect, useState } from "react";
import { InvoiceBillDocument } from "@/components/erp/invoice/InvoiceBillDocument";
import { buildInvoicePrintBranding, type InvoicePrintBranding } from "@/lib/invoice/printBranding";

export function InvoicePrintSample() {
  const [branding, setBranding] = useState<InvoicePrintBranding>(() => buildInvoicePrintBranding(null));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/settings/print", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      if (cancelled) return;
      if (res.ok && json?.data?.branding) setBranding(json.data.branding as InvoicePrintBranding);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <InvoiceBillDocument
      branding={branding}
      invoiceNumber="LS-SAMPLE-0001"
      invoiceDate={new Date()}
      customer={{ name: "Walk-in Customer", phone: "—" }}
      paymentMode="cash"
      rows={[
        {
          sl: 1,
          description: "Sample laptop (SKU DEMO-001)",
          qty: 1,
          rate: 45000,
          gstPercent: 18,
          amount: 53100,
        },
      ]}
      totals={{
        subTotal: 45000,
        discount: 0,
        gst: 8100,
        final: 53100,
      }}
    />
  );
}
