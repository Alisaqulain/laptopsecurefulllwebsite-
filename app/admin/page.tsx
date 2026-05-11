import Link from "next/link";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { RoleKey } from "@/lib/auth/roles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminHomePage() {
  const session = await getSessionFromServerCookies();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">LaptopSecure ERP</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a portal. You’ll only be able to open what your role allows.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="glass p-5">
            <div className="text-sm font-medium">Website Admin</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Products, categories, banners, homepage sections, blogs, SEO.
            </p>
            <div className="mt-4">
              <Button asChild className="w-full" disabled={!session || session.role !== RoleKey.WEBSITE_ADMIN}>
                <Link href="/admin/website">Open</Link>
              </Button>
            </div>
          </Card>

          <Card className="glass p-5">
            <div className="text-sm font-medium">Super Admin ERP</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Purchases, sales, suppliers, stock, analytics, audit logs, reports.
            </p>
            <div className="mt-4">
              <Button asChild className="w-full" disabled={!session || session.role !== RoleKey.SUPER_ADMIN}>
                <Link href="/admin/erp">Open</Link>
              </Button>
            </div>
          </Card>

          <Card className="glass p-5">
            <div className="text-sm font-medium">Sales Entry</div>
            <p className="mt-2 text-sm text-muted-foreground">Billing, invoices, view stock, print bills.</p>
            <div className="mt-4">
              <Button asChild className="w-full" disabled={!session || session.role !== RoleKey.SALES_ADMIN}>
                <Link href="/admin/sales">Open</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

