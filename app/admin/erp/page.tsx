"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErpDashboardExplorer } from "@/components/erp/ErpDashboardExplorer";

type Summary = {
  cards: {
    totalPurchaseAmount: number;
    totalSalesAmount: number;
    currentStockValue: number;
    lowStockCount: number;
  };
  salesTrend: { month: string; sales: number }[];
  recentSales: { _id: string; invoiceNumber: string; date: string; totals: { finalTotal: number } }[];
  recentPurchases: { _id: string; invoiceNumber: string; date: string; totals: { finalTotal: number } }[];
};

type DeleteRequest = {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  message?: string;
  newValue?: { invoiceNumber?: string; reason?: string };
};

function StatCard(props: { label: string; value: string; sub?: string }) {
  return (
    <Card className="glass p-4">
      <div className="text-xs font-medium text-muted-foreground">{props.label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
      {props.sub ? <div className="mt-1 text-xs text-muted-foreground">{props.sub}</div> : null}
    </Card>
  );
}

export default function ErpDashboard() {
  const [data, setData] = useState<Summary | null>(null);
  const [requests, setRequests] = useState<DeleteRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setError(null);
      const [res, reqRes] = await Promise.all([
        fetch("/api/analytics/summary", { cache: "no-store" }),
        fetch("/api/audit/requests", { cache: "no-store" }),
      ]);

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error?.message || "Failed to load analytics");
        setData(null);
      } else {
        setData(json.data as Summary);
      }

      const reqJson = (await reqRes.json().catch(() => null)) as any;
      if (reqRes.ok) setRequests((reqJson?.data?.requests ?? []) as DeleteRequest[]);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ERP dashboard</h1>
        <p className="text-sm text-muted-foreground">Live business snapshot (Super Admin only).</p>
      </div>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total purchases" value={formatPrice(data?.cards.totalPurchaseAmount ?? 0)} />
        <StatCard label="Total sales" value={formatPrice(data?.cards.totalSalesAmount ?? 0)} />
        <StatCard label="Current stock value" value={formatPrice(data?.cards.currentStockValue ?? 0)} />
        <StatCard label="Low stock alerts" value={String(data?.cards.lowStockCount ?? 0)} sub="Needs restock soon" />
      </div>

      <Card className="glass p-4">
        <div className="text-sm font-medium">Sales trend (last 6 months)</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.salesTrend ?? []}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="glass p-4">
          <div className="text-sm font-medium">Recent sales</div>
          <div className="mt-3 divide-y divide-white/5 text-sm">
            {(data?.recentSales ?? []).map((s) => (
              <div key={s._id} className="flex items-center justify-between py-2">
                <div className="text-muted-foreground">{s.invoiceNumber}</div>
                <div className="font-medium">{formatPrice(s.totals.finalTotal)}</div>
              </div>
            ))}
            {(data?.recentSales ?? []).length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No sales yet.</div>
            ) : null}
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="text-sm font-medium">Recent purchases</div>
          <div className="mt-3 divide-y divide-white/5 text-sm">
            {(data?.recentPurchases ?? []).map((p) => (
              <div key={p._id} className="flex items-center justify-between py-2">
                <div className="text-muted-foreground">{p.invoiceNumber?.trim() ? p.invoiceNumber : "—"}</div>
                <div className="font-medium">{formatPrice(p.totals.finalTotal)}</div>
              </div>
            ))}
            {(data?.recentPurchases ?? []).length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No purchases yet.</div>
            ) : null}
          </div>
        </Card>
      </div>

      <ErpDashboardExplorer />

      <Card className="glass p-4">
        <div className="text-sm font-medium">Delete requests from sales staff</div>
        <div className="mt-3 divide-y divide-white/5 text-sm">
          {requests.map((r) => (
            <div key={r._id} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-muted-foreground">
                <span className="font-mono text-xs">{r.newValue?.invoiceNumber ?? String(r.entityId).slice(-6)}</span>
                <span className="mx-2 text-white/20">•</span>
                <span className="text-xs">{new Date(r.createdAt).toLocaleString("en-IN")}</span>
                {r.message ? <div className="mt-1 text-xs text-muted-foreground">{r.message}</div> : null}
              </div>
              <div className="text-xs text-muted-foreground">{r.action.replaceAll("_", " ")}</div>
            </div>
          ))}
          {requests.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No delete requests.</div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

