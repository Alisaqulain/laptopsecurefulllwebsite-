"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { Button } from "@/components/ui/button";

type Me = { session: { id: string; role: string; name?: string } | null };

export default function SalesDashboardPage() {
  const [me, setMe] = useState<Me["session"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      setMe(json?.data?.session ?? null);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Billing and stock — nothing else." />
      <div className="mb-4 text-sm text-muted-foreground">
        {loading ? "Loading…" : me ? `Signed in as ${me.name || me.id}` : "—"}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ErpPanel>
          <h2 className="text-sm font-semibold">New sale</h2>
          <p className="mt-2 text-sm text-muted-foreground">Search product, confirm stock, print invoice.</p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/sales/new-sale">Open</Link>
          </Button>
        </ErpPanel>
        <ErpPanel>
          <h2 className="text-sm font-semibold">Stock check</h2>
          <p className="mt-2 text-sm text-muted-foreground">See what is available to sell (no cost prices).</p>
          <Button asChild className="mt-4" variant="outline" size="sm">
            <Link href="/sales/stock">Open</Link>
          </Button>
        </ErpPanel>
      </div>
    </>
  );
}
