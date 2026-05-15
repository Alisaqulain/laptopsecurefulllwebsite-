"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate, formatPrice } from "@/lib/utils";

type Row = {
  _id: string;
  date: string;
  invoiceNumber: string;
  customerSnapshot?: { name?: string; phone?: string };
  items?: Array<{ name?: string; quantity?: number }>;
  totals?: { finalTotal?: number };
  udhari?: {
    amountReceived?: number;
    balanceDue?: number;
    payments?: Array<{ amount: number; date: string; note?: string }>;
  };
};

type Summary = { openCount: number; totalDue: number };

export function UdhariListTable({ refreshKey = 0 }: { refreshKey?: number }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"open" | "settled" | "all">("open");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<Summary>({ openCount: 0, totalDue: 0 });
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<Record<string, string>>({});
  const [payNote, setPayNote] = useState<Record<string, string>>({});
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const url = new URL("/api/udhari", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("status", status);
    if (q.trim()) url.searchParams.set("q", q.trim());
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as {
      data?: { entries?: Row[]; total?: number; summary?: Summary };
    };
    if (res.ok) {
      setRows(json?.data?.entries ?? []);
      setTotal(json?.data?.total ?? 0);
      setSummary(json?.data?.summary ?? { openCount: 0, totalDue: 0 });
    } else {
      setRows([]);
      setTotal(0);
    }
    setLoading(false);
  }, [page, q, status]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function recordPayment(row: Row) {
    const raw = payAmount[row._id]?.trim();
    const amount = raw ? Number(raw) : 0;
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    const balance = row.udhari?.balanceDue ?? 0;
    if (amount > balance + 0.001) {
      toast.error(`Cannot pay more than balance due (${formatPrice(balance)})`);
      return;
    }

    setPayingId(row._id);
    try {
      const res = await fetch(`/api/udhari/${row._id}/pay`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount,
          note: payNote[row._id]?.trim() || undefined,
        }),
      });
      const json = (await res.json().catch(() => null)) as { error?: { message?: string } };
      if (!res.ok) {
        toast.error(json?.error?.message || "Payment failed");
        return;
      }
      toast.success(
        amount >= balance - 0.001
          ? "Udhari cleared — fully paid"
          : `Received ${formatPrice(amount)} — balance updated`,
      );
      setPayAmount((s) => ({ ...s, [row._id]: "" }));
      setPayNote((s) => ({ ...s, [row._id]: "" }));
      void load();
    } finally {
      setPayingId(null);
    }
  }

  function lineSummary(r: Row) {
    const items = r.items ?? [];
    if (items.length === 0) return "—";
    if (items.length === 1) return `${items[0]?.name ?? "Item"} ×${items[0]?.quantity ?? 0}`;
    return `${items.length} items`;
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <ErpPanel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Udhari / credit ledger</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Customers who owe money on past sales. Record payments to reduce balance.
          </p>
          {summary.openCount > 0 && (
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Total outstanding: </span>
              <strong className="tabular-nums text-amber-700 dark:text-amber-400">
                {formatPrice(summary.totalDue)}
              </strong>
              <span className="mx-2 text-muted-foreground/40">·</span>
              <span className="text-muted-foreground">{summary.openCount} open account(s)</span>
            </p>
          )}
        </div>
        <div className="flex max-w-lg flex-1 flex-wrap gap-2">
          <select
            className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "open" | "settled" | "all");
              setPage(1);
            }}
          >
            <option value="open">Open udhari</option>
            <option value="settled">Cleared</option>
            <option value="all">All with udhari history</option>
          </select>
          <Input
            className="h-9 min-w-[140px] flex-1"
            placeholder="Search customer / invoice…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <Button type="button" variant="outline" size="sm" className="h-9 shrink-0" onClick={() => void load()}>
            Search
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-md border border-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Invoice</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Sold</th>
                <th className="px-3 py-2 text-right font-medium">Bill total</th>
                <th className="px-3 py-2 text-right font-medium">Received</th>
                <th className="px-3 py-2 text-right font-medium">Udhari due</th>
                <th className="px-3 py-2 font-medium">Receive payment</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    {status === "open" ? "No open udhari — all cleared." : "No records found."}
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const balance = r.udhari?.balanceDue ?? 0;
                  const received = r.udhari?.amountReceived ?? 0;
                  const isOpen = balance > 0;
                  return (
                    <tr key={r._id} className="border-t border-border align-top hover:bg-muted/20">
                      <td className="px-3 py-2 text-muted-foreground">{formatDate(r.date)}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.invoiceNumber}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium">{r.customerSnapshot?.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.customerSnapshot?.phone ?? ""}</div>
                      </td>
                      <td className="px-3 py-2">{lineSummary(r)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatPrice(r.totals?.finalTotal ?? 0)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                        {formatPrice(received)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold text-amber-700 dark:text-amber-400">
                        {formatPrice(balance)}
                      </td>
                      <td className="px-3 py-2">
                        {isOpen ? (
                          <div className="flex min-w-[200px] flex-col gap-2">
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                min={0.01}
                                step="0.01"
                                placeholder="Amount ₹"
                                className="h-8 text-sm"
                                value={payAmount[r._id] ?? ""}
                                onChange={(e) => setPayAmount((s) => ({ ...s, [r._id]: e.target.value }))}
                              />
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 shrink-0"
                                disabled={payingId === r._id}
                                onClick={() => void recordPayment(r)}
                              >
                                {payingId === r._id ? "…" : "Clear"}
                              </Button>
                            </div>
                            <Input
                              placeholder="Note (optional)"
                              className="h-8 text-xs"
                              value={payNote[r._id] ?? ""}
                              onChange={(e) => setPayNote((s) => ({ ...s, [r._id]: e.target.value }))}
                            />
                            {(r.udhari?.payments?.length ?? 0) > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {r.udhari!.payments!.length} later payment(s)
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Cleared</span>
                        )}
                      </td>
                    </tr>
                  );
                })
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
