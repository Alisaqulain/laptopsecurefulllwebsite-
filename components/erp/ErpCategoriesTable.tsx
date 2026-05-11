"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErpPanel } from "@/components/erp/ErpPanel";

type Cat = { _id: string; name: string; slug: string; status: string };

export function ErpCategoriesTable({ showAll = true }: { showAll?: boolean }) {
  const [rows, setRows] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const url = showAll ? "/api/categories?all=1" : "/api/categories";
    const res = await fetch(url, { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    setRows(res.ok ? json?.data?.categories ?? [] : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [showAll]);

  return (
    <ErpPanel>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>
      <div className="mt-3 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Slug</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                  No categories.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c._id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{c.slug}</td>
                  <td className="px-3 py-2 text-xs">{c.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ErpPanel>
  );
}
