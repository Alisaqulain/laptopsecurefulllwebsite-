"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Product = {
  _id: string;
  sku: string;
  name: string;
  slug: string;
  brand?: string;
  status: "active" | "inactive";
  images?: string[];
  pricing?: { sellingPrice: number; gstRate?: number; mrp?: number };
  stock?: { onHand: number; reserved: number; sold: number; lowStockThreshold: number };
};

export default function WebsiteProductsPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => items, [items]);

  async function load() {
    setLoading(true);
    setError(null);
    const url = new URL("/api/products", window.location.origin);
    if (q.trim()) url.searchParams.set("q", q.trim());
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setError(json?.error?.message || "Failed to load products");
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(json.data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Catalog management (website-safe view).</p>
        </div>
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name/brand/specs…" />
          <Button onClick={load} disabled={loading}>
            Search
          </Button>
        </div>
      </div>

      <Card className="glass p-4">
        {loading ? <div className="text-sm text-muted-foreground">Loading…</div> : null}
        {error ? <div className="text-sm text-destructive">{error}</div> : null}

        {!loading && !error ? (
          <div className="divide-y divide-white/5">
            {filtered.map((p) => (
              <div key={p._id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {p.name} <span className="text-xs text-muted-foreground">({p.sku})</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.brand ? `${p.brand} · ` : null}
                    Status: {p.status} · Stock: {p.stock?.onHand ?? 0}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">₹</span>
                  <span className="font-semibold">{p.pricing?.sellingPrice ?? 0}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No products found.</div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

