"use client";

import { siteConfig } from "@/lib/config";

export default function SalesSampleInvoicePrintPage() {
  return (
    <div className="min-h-screen bg-white p-8 text-slate-900 print:p-6">
      <style>{`@media print { @page { size: A4; margin: 16mm; } }`}</style>

      <div className="mx-auto max-w-3xl border border-slate-200 p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xl font-bold">{siteConfig.name}</div>
            <div className="mt-2 text-xs leading-relaxed text-slate-600">{siteConfig.contact.address}</div>
            <div className="mt-1 text-xs text-slate-600">GSTIN: — (set in Settings)</div>
          </div>
          <div className="text-right text-xs">
            <div className="font-semibold text-slate-900">TAX INVOICE</div>
            <div className="mt-2 text-slate-600">Invoice #</div>
            <div className="font-mono text-sm">LS-SAMPLE-0001</div>
            <div className="mt-2 text-slate-600">Date</div>
            <div>{new Date().toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 border-b border-slate-200 pb-6 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Bill to</div>
            <div className="mt-1 text-sm font-medium">Walk-in Customer</div>
            <div className="text-xs text-slate-600">Phone: —</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Ship to</div>
            <div className="mt-1 text-sm text-slate-600">Same as billing</div>
          </div>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-2">#</th>
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">GST%</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-3">1</td>
              <td className="py-3">Sample laptop (SKU)</td>
              <td className="py-3 text-right tabular-nums">1</td>
              <td className="py-3 text-right tabular-nums">₹45,000.00</td>
              <td className="py-3 text-right tabular-nums">18%</td>
              <td className="py-3 text-right tabular-nums font-medium">₹53,100.00</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Taxable value</span>
              <span className="tabular-nums">₹45,000.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CGST</span>
              <span className="tabular-nums">₹4,050.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST</span>
              <span className="tabular-nums">₹4,050.00</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">₹53,100.00</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-slate-200 pt-6 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Terms</div>
            <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
              <li>Goods once sold will not be taken back.</li>
              <li>Warranty as per manufacturer policy.</li>
            </ul>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">For {siteConfig.name}</div>
            <div className="mt-10 border-t border-slate-300 pt-2 text-xs text-slate-600">Authorized signatory</div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl justify-end gap-2 print:hidden">
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  );
}
