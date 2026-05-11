import { PageHeader } from "@/components/erp/PageHeader";
import { StatCard } from "@/components/erp/StatCard";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { ErpDashboardCharts } from "@/components/erp/ErpDashboardCharts";
import { getSuperAdminDashboardSummary } from "@/lib/erp/get-dashboard-summary";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function ErpDashboardPage() {
  const d = await getSuperAdminDashboardSummary();

  return (
    <>
      <PageHeader title="Dashboard" description="Purchases, sales, and stock at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total purchases" value={d.cards.totalPurchases} />
        <StatCard label="Total sales" value={d.cards.totalSales} />
        <StatCard label="Stock on hand (units)" value={d.cards.totalStockUnits} format="number" />
        <StatCard label="Low stock products" value={d.cards.lowStockCount} format="number" />
      </div>

      <ErpDashboardCharts salesTrend={d.salesTrend} purchaseTrend={d.purchaseTrend} />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ErpPanel>
          <h2 className="text-sm font-semibold">Recent sales</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-2 font-medium">Invoice</th>
                  <th className="pb-2 pr-2 font-medium">Date</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {d.recentSales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      No sales yet.
                    </td>
                  </tr>
                ) : (
                  d.recentSales.map((r) => (
                    <tr key={r.id} className="border-b border-border/80">
                      <td className="py-2 pr-2 font-mono text-xs">{r.invoiceNumber}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{formatDate(r.date)}</td>
                      <td className="py-2 text-right tabular-nums">{formatPrice(r.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ErpPanel>

        <ErpPanel>
          <h2 className="text-sm font-semibold">Recent purchases</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-2 font-medium">Invoice</th>
                  <th className="pb-2 pr-2 font-medium">Date</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {d.recentPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      No purchases yet.
                    </td>
                  </tr>
                ) : (
                  d.recentPurchases.map((r) => (
                    <tr key={r.id} className="border-b border-border/80">
                      <td className="py-2 pr-2 font-mono text-xs">{r.invoiceNumber}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{formatDate(r.date)}</td>
                      <td className="py-2 text-right tabular-nums">{formatPrice(r.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ErpPanel>
      </div>

    </>
  );
}
