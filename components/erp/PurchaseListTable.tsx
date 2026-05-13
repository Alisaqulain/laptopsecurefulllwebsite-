"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate, formatPrice } from "@/lib/utils";

type Row = {
  _id: string;
  date: string;
  invoiceNumber: string;
  totals?: { finalTotal?: number; quantity?: number };
  supplierId?: { name?: string } | null;
};

export function PurchaseListTable({
  refreshKey = 0,
  /** When set (e.g. on purchase entry), list is filtered to that supplier — same table as “all purchases”, no second panel. */
  supplierId,
}: {
  refreshKey?: number;
  supplierId?: string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const sid = supplierId?.trim() ?? "";
  const limit = sid ? 100 : 15;

  useEffect(() => {
    setPage(1);
    setSelectedIds({});
  }, [sid, refreshKey]);

  const load = useCallback(async () => {
    setLoading(true);
    const url = new URL("/api/purchases", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (q.trim()) url.searchParams.set("q", q.trim());
    if (sid) url.searchParams.set("supplierId", sid);
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    if (res.ok) {
      setRows(json?.data?.purchases ?? []);
      setTotal(json?.data?.total ?? 0);
      setSelectedIds({});
    } else {
      setRows([]);
      setTotal(0);
      setSelectedIds({});
    }
    setLoading(false);
  }, [page, q, sid, limit]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const pages = Math.max(1, Math.ceil(total / limit));

  const selected = useMemo(() => rows.filter((r) => selectedIds[r._id]), [rows, selectedIds]);
  const selectedCount = selected.length;
  const selectedQty = useMemo(
    () => selected.reduce((s, r) => s + (r.totals?.quantity ?? 0), 0),
    [selected],
  );
  const selectedAmount = useMemo(
    () => selected.reduce((s, r) => s + (r.totals?.finalTotal ?? 0), 0),
    [selected],
  );
  const allChecked = rows.length > 0 && rows.every((r) => selectedIds[r._id]);
  const someChecked = rows.some((r) => selectedIds[r._id]) && !allChecked;

  async function removePurchase(id: string, invoice: string) {
    if (!confirm(`Delete purchase ${invoice.trim() || "(no bill #)"}? Stock quantities from this bill will be reduced.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => null)) as { error?: { message?: string } };
      if (!res.ok) {
        toast.error(json?.error?.message || "Delete failed");
        return;
      }
      toast.success("Purchase removed — stock adjusted.");
      void load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ErpPanel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">{sid ? "Purchases for this supplier" : "Recent purchases"}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {sid
              ? "Bills for the supplier selected in the form above. Change supplier there to refresh this list."
              : "All suppliers — search by invoice number."}
          </p>
        </div>
        <div className="flex max-w-sm flex-1 gap-2">
          <Input className="h-9" placeholder="Search invoice…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setPage(1)}>
            Search
          </Button>
        </div>
      </div>

      {selectedCount > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            Selected: <strong className="text-foreground">{selectedCount}</strong>
            <span className="mx-2 opacity-30">•</span>
            Bill qty: <strong className="text-foreground tabular-nums">{selectedQty}</strong>
            <span className="mx-2 opacity-30">•</span>
            Amount: <strong className="text-foreground tabular-nums">{formatPrice(selectedAmount)}</strong>
          </span>
        </div>
      ) : null}

      <div className="mt-3 overflow-x-auto rounded-md border border-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    title="Select all on this page"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked;
                    }}
                    onChange={(e) => {
                      const next: Record<string, boolean> = {};
                      if (e.target.checked) rows.forEach((r) => (next[r._id] = true));
                      setSelectedIds(next);
                    }}
                  />
                </th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Invoice</th>
                <th className="px-3 py-2 font-medium">Supplier</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No purchases found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r._id}
                    className={`border-t border-border ${selectedIds[r._id] ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedIds[r._id])}
                        onChange={(e) => setSelectedIds((s) => ({ ...s, [r._id]: e.target.checked }))}
                      />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(r.date)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.invoiceNumber?.trim() ? r.invoiceNumber : "—"}</td>
                    <td className="px-3 py-2">{(r.supplierId as any)?.name ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.totals?.quantity ?? 0}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatPrice(r.totals?.finalTotal ?? 0)}</td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 px-2"
                        disabled={deletingId === r._id}
                        onClick={() => void removePurchase(r._id, r.invoiceNumber)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page} of {pages} · {total} total
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </ErpPanel>
  );
}
