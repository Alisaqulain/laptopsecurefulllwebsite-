import { getSessionFromServerCookies } from "@/lib/auth/session";
import { PageHeader } from "@/components/erp/PageHeader";
import { ErpPanel } from "@/components/erp/ErpPanel";
export default async function WebsiteAdminDashboardPage() {
  const session = await getSessionFromServerCookies();

  return (
    <>
      <PageHeader
        title="Website dashboard"
        description="Catalog, content, and storefront configuration. ERP billing and purchases are not available from this portal."
      />
      <div className="mb-4 text-sm text-muted-foreground">
        {session ? (
          <>
            Signed in as <span className="font-medium text-foreground">{session.name || session.id}</span> · Role{" "}
            <span className="font-mono text-xs">{session.role}</span>
          </>
        ) : (
          "—"
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <ErpPanel className="py-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Products</div>
          <p className="mt-2 text-sm text-muted-foreground">Open Products for catalog CRUD and images.</p>
        </ErpPanel>
        <ErpPanel className="py-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Categories</div>
          <p className="mt-2 text-sm text-muted-foreground">Organize the shop navigation and filters.</p>
        </ErpPanel>
        <ErpPanel className="py-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Homepage</div>
          <p className="mt-2 text-sm text-muted-foreground">Banners and featured products (when APIs are live).</p>
        </ErpPanel>
      </div>
      <ErpPanel className="mt-6">
        <h2 className="text-sm font-semibold">Next steps</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          <li>Use Products for CRUD, images, MRP/selling price, and featured flags.</li>
          <li>Use Homepage Banners and Blogs when those modules are wired to the API.</li>
          <li>SEO Settings will centralize meta defaults for listing pages.</li>
        </ul>
      </ErpPanel>
    </>
  );
}
