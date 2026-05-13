"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate, formatPrice } from "@/lib/utils";

type ProductRow = {
  _id: string;
  sku: string;
  name: string;
  stock?: { onHand?: number; lowStockThreshold?: number };
  pricing?: { sellingPrice?: number };
};

type PurchaseRow = {
  _id: string;
  date: string;
  invoiceNumber: string;
  totals?: { finalTotal?: number };
};

type Supplier = { _id: string; name: string };

function stockLevelLabel(onHand: number, threshold: number) {
  if (onHand <= 0) return "Out";
  if (onHand <= threshold) return "Low";
  return "OK";
}

export function ErpDashboardExplorer() {
  const [stockQ, setStockQ] = useState("");
  const [stockLevel, setStockLevel] = useState<"" | "low" | "out">("");
  const [stockRows, setStockRows] = useState<ProductRow[]>([]);
  const [stockLoading, setStockLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [purchaseRows, setPurchaseRows] = useState<PurchaseRow[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/suppliers", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as { data?: { suppliers?: Supplier[] } };
      setSuppliers(res.ok ? json?.data?.suppliers ?? [] : []);
    })();
  }, []);

  const loadStock = useCallback(async () => {
    setStockLoading(true);
    const url = new URL("/api/products", window.location.origin);
    if (stockQ.trim()) url.searchParams.set("q", stockQ.trim());
    if (stockLevel) url.searchParams.set("stockLevel", stockLevel);
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as { data?: { products?: ProductRow[] } };
    setStockRows(res.ok ? json?.data?.products ?? [] : []);
    setStockLoading(false);
  }, [stockQ, stockLevel]);

  const loadPurchases = useCallback(async () => {
    if (!supplierId.trim()) {
      setPurchaseRows([]);
      return;
    }
    setPurchaseLoading(true);
    const url = new URL("/api/purchases", window.location.origin);
    url.searchParams.set("supplierId", supplierId.trim());
    url.searchParams.set("limit", "50");
    url.searchParams.set("page", "1");
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as { data?: { purchases?: PurchaseRow[] } };
    setPurchaseRows(res.ok ? json?.data?.purchases ?? [] : []);
    setPurchaseLoading(false);
  }, [supplierId]);

  useEffect(() => {
    void loadStock();
    // Intentionally only initial load; further loads use the Search button.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only bootstrap
  }, []);

  useEffect(() => {
    void loadPurchases();
  }, [loadPurchases]);

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <ErpPanel>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Stock lookup</h2>
            <p className="mt-1 text-xs text-muted-foreground">Search catalogue and filter by shelf status. Opens the same data as the Stock page.</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="shrink-0" asChild>
            <Link href={stockQ.trim() ? `/erp/stock?q=${encodeURIComponent(stockQ.trim())}` : "/erp/stock"}>Full stock page</Link>
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm sm:w-40"
            value={stockLevel}
            onChange={(e) => setStockLevel(e.target.value as "" | "low" | "out")}
          >
            <option value="">All levels</option>
            <option value="low">Low only</option>
            <option value="out">Out only</option>
          </select>
          <Input className="h-9 sm:max-w-xs sm:flex-1" placeholder="Search SKU / name…" value={stockQ} onChange={(e) => setStockQ(e.target.value)} />
          <Button type="button" size="sm" variant="secondary" onClick={() => void loadStock()}>
            Search
          </Button>
        </div>
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          {stockLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : (
            <table className="w-full min-w-[360px] text-left text-sm">
              <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 font-medium">Level</th>
                  <th className="px-3 py-2 text-right font-medium">Selling</th>
                </tr>
              </thead>
              <tbody>
                {stockRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                      No products match.
                    </td>
                  </tr>
                ) : (
                  stockRows.slice(0, 12).map((p) => {
                    const on = p.stock?.onHand ?? 0;
                    const th = p.stock?.lowStockThreshold ?? 2;
                    const lvl = stockLevelLabel(on, th);
                    const cls = lvl === "Out" ? "text-destructive" : lvl === "Low" ? "text-amber-700" : "text-muted-foreground";
                    return (
                      <tr key={p._id} className="border-t border-border">
                        <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                        <td className="px-3 py-2">{p.name}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{on}</td>
                        <td className={`px-3 py-2 text-xs font-medium ${cls}`}>{lvl}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatPrice(p.pricing?.sellingPrice ?? 0)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        {stockRows.length > 12 ? (
          <p className="mt-2 text-xs text-muted-foreground">Showing 12 of {stockRows.length}. Use the stock page for the full list.</p>
        ) : null}
      </ErpPanel>

      <ErpPanel>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Purchases by supplier</h2>
            <p className="mt-1 text-xs text-muted-foreground">Pick a supplier to list recent bills (same API as Purchases).</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="shrink-0" asChild>
            <Link href="/erp/purchases">Purchases</Link>
          </Button>
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-muted-foreground">Supplier</label>
          <select
            className="mt-1 flex h-9 w-full max-w-md rounded-md border border-input bg-background px-2 text-sm"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Select supplier…</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          {purchaseLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : !supplierId ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Choose a supplier to load bills.</div>
          ) : (
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Invoice</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {purchaseRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                      No purchases for this supplier.
                    </td>
                  </tr>
                ) : (
                  purchaseRows.map((p) => (
                    <tr key={p._id} className="border-t border-border">
                      <td className="px-3 py-2 text-muted-foreground">{formatDate(p.date)}</td>
                      <td className="px-3 py-2 font-mono text-xs">{p.invoiceNumber?.trim() ? p.invoiceNumber : "—"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatPrice(p.totals?.finalTotal ?? 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </ErpPanel>
    </div>
  );
}
