"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate, formatPrice } from "@/lib/utils";

type DeletedSaleRow = {
  _id: string;
  invoiceNumber: string;
  date: string;
  deletedAt: string;
  deleteReason?: string;
  customerSnapshot?: { name?: string; phone?: string };
  totals?: { finalTotal?: number };
  items?: Array<{ name?: string; quantity?: number }>;
  deletedBy?: { name?: string; role?: string } | null;
};

export function DeletedSalesLogTable() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<DeletedSaleRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const limit = 20;

  const pages = Math.max(1, Math.ceil(total / limit));

  const load = useCallback(async () => {
    setLoading(true);
    const url = new URL("/api/sales/deleted", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (q.trim()) url.searchParams.set("q", q.trim());
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    if (res.ok) {
      setRows(json?.data?.sales ?? []);
      setTotal(json?.data?.total ?? 0);
    } else {
      setRows([]);
      setTotal(0);
    }
    setLoading(false);
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  const lineSummary = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of rows) {
      const items = r.items ?? [];
      if (items.length === 0) map.set(r._id, "—");
      else if (items.length === 1) map.set(r._id, `${items[0]?.name ?? "Item"} ×${items[0]?.quantity ?? 0}`);
      else map.set(r._id, `${items.length} items · Qty ${items.reduce((s, it) => s + (it.quantity ?? 0), 0)}`);
    }
    return map;
  }, [rows]);

  async function restore(id: string, invoice: string) {
    if (!confirm(`Restore invoice ${invoice}? Stock will be reduced again.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/sales/${id}/restore`, { method: "POST" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        toast.error(json?.error?.message || "Restore failed");
        return;
      }
      toast.success("Sale restored.");
      void load();
    } finally {
      setBusyId(null);
    }
  }

  async function purge(id: string, invoice: string) {
    if (!confirm(`Permanently delete invoice ${invoice}? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/sales/${id}/purge`, { method: "DELETE" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        toast.error(json?.error?.message || "Permanent delete failed");
        return;
      }
      toast.success("Sale permanently deleted.");
      void load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ErpPanel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Deleted sales log</h2>
          <p className="mt-1 text-xs text-muted-foreground">Restore deleted invoices or permanently remove them.</p>
        </div>
        <div className="flex max-w-md flex-1 gap-2">
          <Input className="h-9" placeholder="Search invoice / customer…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setPage(1)}>
            Search
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-md border border-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Sale date</th>
                <th className="px-3 py-2 font-medium">Deleted on</th>
                <th className="px-3 py-2 font-medium">Invoice</th>
                <th className="px-3 py-2 font-medium">Deleted by</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Products</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    No deleted sales.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} className="border-t border-border">
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(r.date)}</td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(r.deletedAt)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.invoiceNumber}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.deletedBy?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.deletedBy?.role ?? ""}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.customerSnapshot?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.customerSnapshot?.phone ?? ""}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{lineSummary.get(r._id) ?? "—"}</div>
                      {r.deleteReason ? <div className="text-xs text-muted-foreground">{r.deleteReason}</div> : null}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">{formatPrice(r.totals?.finalTotal ?? 0)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button type="button" variant="outline" size="sm" className="h-8 px-2" disabled={busyId === r._id} onClick={() => void restore(r._id, r.invoiceNumber)}>
                          Restore
                        </Button>
                        <Button type="button" variant="destructive" size="sm" className="h-8 px-2" disabled={busyId === r._id} onClick={() => void purge(r._id, r.invoiceNumber)}>
                          Permanent delete
                        </Button>
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

