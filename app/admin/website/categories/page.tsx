"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  parentId?: string | null;
};

export default function WebsiteCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/categories", { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setError(json?.error?.message || "Failed to load categories");
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(json.data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Parent/child categories + SEO slug.</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      <Card className="glass p-4">
        {loading ? <div className="text-sm text-muted-foreground">Loading…</div> : null}
        {error ? <div className="text-sm text-destructive">{error}</div> : null}
        {!loading && !error ? (
          <div className="divide-y divide-white/5">
            {items.map((c) => (
              <div key={c._id} className="py-3">
                <div className="font-medium">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {c.slug} · {c.status}
                </div>
              </div>
            ))}
            {items.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No categories found.</div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

