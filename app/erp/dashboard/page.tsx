import { PageHeader } from "@/components/erp/PageHeader";
import { StatCard } from "@/components/erp/StatCard";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { ErpDashboardCharts } from "@/components/erp/ErpDashboardCharts";
import { ErpDemoDataToolbar } from "@/components/erp/ErpDemoDataToolbar";
import { getSuperAdminDashboardSummary } from "@/lib/erp/get-dashboard-summary";
import { formatDate, formatPrice } from "@/lib/utils";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { RoleKey } from "@/lib/auth/roles";

/** Dashboard reads live Mongo aggregates — do not static-prerender at build (CI / offline builds). */
export const dynamic = "force-dynamic";

export default async function ErpDashboardPage() {
  const session = await getSessionFromServerCookies();
  const showDemoTools = session?.role === RoleKey.SUPER_ADMIN;

  const d = await getSuperAdminDashboardSummary();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Purchases, sales, and stock at a glance."
        actions={<ErpDemoDataToolbar enabled={showDemoTools} />}
      />

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

      <div className="mt-6">
        <ErpPanel>
          <h2 className="text-sm font-semibold">Recent activity / notifications</h2>
          <p className="mt-1 text-xs text-muted-foreground">Deletes and restores are shown here immediately.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-2 font-medium">When</th>
                  <th className="pb-2 pr-2 font-medium">Action</th>
                  <th className="pb-2 pr-2 font-medium">Invoice</th>
                  <th className="pb-2 pr-2 font-medium">Customer</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(d as any).recentActivity?.length ? (
                  (d as any).recentActivity.map((a: any) => (
                    <tr key={a.id} className="border-b border-border/80">
                      <td className="py-2 pr-2 text-muted-foreground">{formatDate(a.createdAt)}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{String(a.action).replaceAll("_", " ")}</td>
                      <td className="py-2 pr-2 font-mono text-xs">{a.newValue?.invoiceNumber ?? "—"}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{a.newValue?.customer ?? "—"}</td>
                      <td className="py-2 text-right tabular-nums">{formatPrice(a.newValue?.amount ?? 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No recent activity.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ErpPanel>
      </div>

    </>
  );
}
