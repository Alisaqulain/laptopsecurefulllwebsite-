"use client";

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErpPanel } from "@/components/erp/ErpPanel";

type Row = { month: string; sales?: number; received?: number; purchases?: number };

export function ErpDashboardCharts({
  salesTrend,
  purchaseTrend,
}: {
  salesTrend: Row[];
  purchaseTrend: Row[];
}) {
  const purchaseByMonth = new Map(purchaseTrend.map((p) => [p.month, p.purchases ?? 0]));
  const merged = salesTrend.map((s) => ({
    month: s.month,
    sales: s.sales ?? 0,
    received: s.received ?? 0,
    purchases: purchaseByMonth.get(s.month) ?? 0,
  }));

  return (
    <ErpPanel className="mt-6">
      <h2 className="text-sm font-semibold text-foreground">Monthly purchases & sales</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Last six months — selling (billed), cash received, and purchases.
      </p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={56} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="sales" name="Selling" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line
              type="monotone"
              dataKey="received"
              name="Cash received"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="purchases"
              name="Purchases"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ErpPanel>
  );
}
