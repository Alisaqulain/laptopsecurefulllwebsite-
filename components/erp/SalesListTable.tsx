"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate, formatPrice } from "@/lib/utils";

type Row = {
  _id: string;
  date: string;
  invoiceNumber: string;
  paymentMode?: string;
  totals?: { finalTotal?: number };
  customerSnapshot?: { name?: string; phone?: string };
  items?: Array<{ name?: string; quantity?: number }>;
  createdBy?: { name?: string; role?: string } | null;
};

type Meta = { showAmounts: boolean; canDelete: boolean };

export function SalesListTable({
  refreshKey = 0,
  mode = "erp",
}: {
  refreshKey?: number;
  mode?: "erp" | "sales";
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [meta, setMeta] = useState<Meta>({ showAmounts: true, canDelete: true });
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const url = new URL("/api/sales", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (q.trim()) url.searchParams.set("q", q.trim());
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as {
      data?: { sales?: Row[]; total?: number; meta?: Partial<Meta> };
    };
    if (res.ok) {
      setRows(json?.data?.sales ?? []);
      setTotal(json?.data?.total ?? 0);
      setMeta({
        showAmounts: json?.data?.meta?.showAmounts ?? true,
        canDelete: json?.data?.meta?.canDelete ?? true,
      });
      setSelectedIds({});
    } else {
      setRows([]);
      setTotal(0);
      setSelectedIds({});
    }
    setLoading(false);
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function removeSale(id: string, invoice: string) {
    if (!confirm(`Delete sale ${invoice}? Stock quantities will be restored.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => null)) as { error?: { message?: string } };
      if (!res.ok) { toast.error(json?.error?.message || "Delete failed"); return; }
      toast.success("Sale removed — stock restored.");
      void load();
    } finally {
      setDeletingId(null);
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit));
  const selected = useMemo(() => rows.filter((r) => selectedIds[r._id]), [rows, selectedIds]);
  const selectedCount = selected.length;
  const selectedQty = useMemo(() => selected.reduce((s, r) => s + (r.items ?? []).reduce((a, it) => a + (it.quantity ?? 0), 0), 0), [selected]);
  const selectedAmount = useMemo(() => selected.reduce((s, r) => s + (r.totals?.finalTotal ?? 0), 0), [selected]);
  const allChecked = rows.length > 0 && rows.every((r) => selectedIds[r._id]);
  const someChecked = rows.some((r) => selectedIds[r._id]) && !allChecked;

  async function bulkDeleteSelected() {
    if (selectedCount === 0) return;
    if (!confirm(`Delete ${selectedCount} sale(s)? Stock will be restored for each invoice.`)) return;
    setDeletingId("bulk");
    try {
      /** Sequential deletes avoid MongoDB transaction / write conflicts when many sales touch the same products. */
      let okCount = 0;
      for (const r of selected) {
        const res = await fetch(`/api/sales/${r._id}`, { method: "DELETE" });
        if (res.ok) okCount += 1;
      }
      if (okCount === selectedCount) toast.success(`Deleted ${okCount} sale(s).`);
      else toast.error(`Deleted ${okCount}/${selectedCount}. Some failed.`);
      void load();
    } finally {
      setDeletingId(null);
    }
  }

  function lineSummary(r: Row) {
    const items = r.items ?? [];
    if (items.length === 0) return "—";
    if (items.length === 1) return `${items[0]?.name ?? "Item"} ×${items[0]?.quantity ?? 0}`;
    return `${items.length} items · Qty ${items.reduce((s, it) => s + (it.quantity ?? 0), 0)}`;
  }

  const viewHref = (id: string) => (mode === "sales" ? `/sales/invoices/view/${id}` : `/erp/sales/view/${id}`);
  const printHref = (id: string) => (mode === "sales" ? `/sales/print/sale/${id}` : `/erp/print/sale/${id}`);

  const colCount = 8 + (meta.showAmounts ? 1 : 0);

  return (
    <ErpPanel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">All sales</h2>
          <p className="mt-1 text-xs text-muted-foreground">Shared across all staff — one central sales record.</p>
        </div>
        <div className="flex max-w-md flex-1 gap-2">
          <Input
            className="h-9"
            placeholder="Search invoice / customer…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => { setPage(1); void load(); }}>
            Search
          </Button>
        </div>
      </div>

      {/* Selection summary bar */}
      {selectedCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            Selected: <strong className="text-foreground">{selectedCount}</strong>
            <span className="mx-2 opacity-30">•</span>
            Qty: <strong className="text-foreground tabular-nums">{selectedQty}</strong>
            {meta.showAmounts && (
              <>
                <span className="mx-2 opacity-30">•</span>
                Amount: <strong className="text-foreground tabular-nums">{formatPrice(selectedAmount)}</strong>
              </>
            )}
          </span>
          {meta.canDelete && (
            <Button type="button" variant="destructive" size="sm" disabled={deletingId === "bulk"} onClick={() => void bulkDeleteSelected()}>
              Bulk delete selected
            </Button>
          )}
        </div>
      )}

      <div className="mt-3 overflow-x-auto rounded-md border border-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={(e) => {
                      const next: Record<string, boolean> = {};
                      if (e.target.checked) rows.forEach((r) => (next[r._id] = true));
                      setSelectedIds(next);
                    }}
                  />
                </th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Invoice</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Payment</th>
                <th className="px-3 py-2 font-medium">Created by</th>
                {meta.showAmounts && <th className="px-3 py-2 text-right font-medium">Amount</th>}
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="px-3 py-8 text-center text-muted-foreground">
                    No sales found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} className={`border-t border-border transition-colors ${selectedIds[r._id] ? "bg-primary/5" : "hover:bg-muted/20"}`}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedIds[r._id])}
                        onChange={(e) => setSelectedIds((s) => ({ ...s, [r._id]: e.target.checked }))}
                      />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(r.date)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.invoiceNumber}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{lineSummary(r)}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.customerSnapshot?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.customerSnapshot?.phone ?? ""}</div>
                    </td>
                    <td className="px-3 py-2 capitalize text-muted-foreground">{r.paymentMode?.replace("_", " ") ?? "—"}</td>
                    <td className="px-3 py-2">
                      {r.createdBy ? (
                        <>
                          <div className="font-medium">{r.createdBy.name ?? "—"}</div>
                          <div className="text-xs text-muted-foreground capitalize">{r.createdBy.role?.toLowerCase().replace("_", " ")}</div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    {meta.showAmounts && (
                      <td className="px-3 py-2 text-right tabular-nums font-semibold">{formatPrice(r.totals?.finalTotal ?? 0)}</td>
                    )}
                    <td className="px-3 py-2 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button type="button" variant="outline" size="sm" className="h-8 px-2" asChild>
                          <Link href={viewHref(r._id)}>
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View
                          </Link>
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="h-8 px-2" asChild>
                          <a href={printHref(r._id)} target="_blank" rel="noreferrer">
                            <Download className="mr-1 h-3.5 w-3.5" />
                            Download
                          </a>
                        </Button>
                        {meta.canDelete && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8 px-2"
                            disabled={deletingId === r._id}
                            onClick={() => void removeSale(r._id, r.invoiceNumber)}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>Page {page} of {pages} · {total} total</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </ErpPanel>
  );
}
