"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { InvoicePrintBranding } from "@/lib/invoice/printBranding";

export type InvoiceLineRow = {
  sl: number;
  description: string;
  qty: number;
  rate: number;
  gstPercent: number;
  amount: number;
};

export type InvoiceBillDocumentProps = {
  branding: InvoicePrintBranding;
  /** e.g. TAX INVOICE / BILL OF SUPPLY */
  docTitle?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  customer: { name: string; phone?: string; address?: string };
  paymentMode?: string | null;
  notes?: string | null;
  rows: InvoiceLineRow[];
  totals: { subTotal: number; discount: number; gst: number; final: number };
};

const printCss = `
@media print {
  @page { size: A4; margin: 12mm; }
  .invoice-no-print { display: none !important; }
  .invoice-sheet { box-shadow: none !important; border-radius: 0 !important; }
}
`;

function resolveLogoSrc(logoUrl: string | null): string | null {
  if (!logoUrl?.trim()) return null;
  const u = logoUrl.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return u;
  return `/${u}`;
}

function formatPaymentMode(mode?: string | null): string {
  if (!mode) return "—";
  const map: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    card: "Card",
    bank_transfer: "Bank transfer",
    mixed: "Mixed",
  };
  return map[mode] ?? mode;
}

function InvoiceLogo({ src, companyName }: { src: string | null; companyName: string }) {
  const [broken, setBroken] = useState(false);
  const resolved = resolveLogoSrc(src);
  if (!resolved || broken) {
    const initial = companyName.trim().charAt(0).toUpperCase() || "L";
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-sky-600 to-indigo-600 text-xl font-bold text-white shadow-sm"
        aria-hidden
      >
        {initial}
      </div>
    );
  }
  return (
    <div className="flex h-14 max-w-[200px] shrink-0 items-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- print/PDF: full URL + reliable layout */}
      <img
        src={resolved}
        alt=""
        className="max-h-14 max-w-[200px] object-contain object-left"
        onError={() => setBroken(true)}
      />
    </div>
  );
}

export function InvoiceBillDocument({
  branding,
  docTitle = "TAX INVOICE",
  invoiceNumber,
  invoiceDate,
  customer,
  paymentMode,
  notes,
  rows,
  totals,
}: InvoiceBillDocumentProps) {
  const { company, invoice } = branding;
  const taxableBase = Math.max(0, totals.subTotal - totals.discount);
  const dateStr = invoiceDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/80 p-4 text-slate-900 print:bg-white print:p-0 md:p-8">
      <style>{printCss}</style>

      <div className="invoice-sheet mx-auto max-w-[210mm] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10 print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <div className="h-1.5 bg-gradient-to-r from-sky-600 via-blue-500 to-orange-500" />

        <div className="p-6 sm:p-8 md:p-10">
          <header className="flex flex-col gap-6 border-b border-slate-100 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start">
              <InvoiceLogo src={company.logoUrl} companyName={company.name} />
              <div className="min-w-0 flex-1 space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{company.name}</h1>
                <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">{company.address}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-600">
                  {company.gstNumber ? (
                    <span>
                      <span className="font-semibold text-slate-700">GSTIN</span> {company.gstNumber}
                    </span>
                  ) : null}
                  {company.phone ? (
                    <span>
                      <span className="font-semibold text-slate-700">Phone</span> {company.phone}
                    </span>
                  ) : null}
                  {company.email ? (
                    <span>
                      <span className="font-semibold text-slate-700">Email</span> {company.email}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-3 text-right sm:pl-4">
              <div className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
                {docTitle}
              </div>
              <dl className="space-y-2 text-xs sm:text-sm">
                <div>
                  <dt className="text-slate-500">Invoice no.</dt>
                  <dd className="font-mono text-base font-semibold text-slate-900">{invoiceNumber}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Date</dt>
                  <dd className="font-medium text-slate-800">{dateStr}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Payment</dt>
                  <dd className="font-medium text-slate-800">{formatPaymentMode(paymentMode)}</dd>
                </div>
              </dl>
            </div>
          </header>

          <section className="mt-8 grid gap-8 border-b border-slate-100 pb-8 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bill to</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">{customer.name || "—"}</div>
              {customer.phone ? <div className="mt-1 text-xs text-slate-600">Phone: {customer.phone}</div> : null}
              {customer.address ? (
                <div className="mt-2 text-xs leading-relaxed text-slate-600">{customer.address}</div>
              ) : null}
            </div>
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ship to</div>
              <div className="mt-2 text-sm text-slate-600">Same as billing address</div>
            </div>
          </section>

          {notes?.trim() ? (
            <div className="mt-6 rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-xs text-amber-950">
              <span className="font-semibold">Note: </span>
              {notes.trim()}
            </div>
          ) : null}

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900 text-left text-[10px] font-bold uppercase tracking-wider text-white">
                  <th className="px-3 py-3 sm:px-4">#</th>
                  <th className="px-3 py-3 sm:px-4">Item & description</th>
                  <th className="px-3 py-3 text-right sm:px-4">Qty</th>
                  <th className="px-3 py-3 text-right sm:px-4">Rate</th>
                  <th className="px-3 py-3 text-right sm:px-4">GST%</th>
                  <th className="px-3 py-3 text-right sm:px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No line items
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.sl} className="border-t border-slate-100 odd:bg-slate-50/40">
                      <td className="px-3 py-3 align-top tabular-nums text-slate-600 sm:px-4">{r.sl}</td>
                      <td className="px-3 py-3 align-top font-medium text-slate-900 sm:px-4">{r.description}</td>
                      <td className="px-3 py-3 align-top text-right tabular-nums text-slate-800 sm:px-4">{r.qty}</td>
                      <td className="px-3 py-3 align-top text-right tabular-nums text-slate-800 sm:px-4">
                        {formatPrice(r.rate)}
                      </td>
                      <td className="px-3 py-3 align-top text-right tabular-nums text-slate-600 sm:px-4">
                        {r.gstPercent}%
                      </td>
                      <td className="px-3 py-3 align-top text-right text-base font-semibold tabular-nums text-slate-900 sm:px-4">
                        {formatPrice(r.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md flex-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Terms &amp; conditions</div>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs leading-relaxed text-slate-600">
                {invoice.terms.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="w-full shrink-0 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:w-80">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Taxable value</span>
                <span className="tabular-nums font-medium text-slate-800">{formatPrice(taxableBase)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Discount</span>
                <span className="tabular-nums font-medium text-slate-800">{formatPrice(totals.discount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>GST</span>
                <span className="tabular-nums font-medium text-slate-800">{formatPrice(totals.gst)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="tabular-nums text-sky-700">{formatPrice(totals.final)}</span>
              </div>
              <p className="border-t border-slate-200 pt-3 text-[10px] leading-relaxed text-slate-500">
                Amounts are in Indian Rupees (INR). This is a computer-generated document; signature is valid when
                printed and signed by authorised personnel.
              </p>
            </div>
          </div>

          <footer className="mt-10 flex flex-col items-stretch justify-between gap-6 border-t border-slate-100 pt-8 sm:flex-row sm:items-end">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">Thank you for your business</div>
            <div className="text-right sm:min-w-[200px]">
              <div className="text-xs text-slate-500">For {company.name}</div>
              <div className="mt-12 border-t border-slate-300 pt-2 text-xs font-medium text-slate-700">
                {invoice.signatureLabel}
              </div>
            </div>
          </footer>
        </div>
      </div>

      <div className="invoice-no-print mx-auto mt-6 flex max-w-[210mm] justify-end gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
