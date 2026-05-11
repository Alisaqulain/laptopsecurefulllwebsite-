import "../erp/erp.css";
import { ErpChrome } from "@/components/erp/ErpChrome";
import { WEBSITE_ADMIN_NAV } from "@/lib/erp/nav";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { Toaster } from "sonner";

export default async function WebsiteAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromServerCookies();
  const label = session?.name?.trim() || session?.id || "User";

  return (
    <div className="erp-skin text-foreground">
      <Toaster richColors position="top-center" />
      <ErpChrome title="Website" nav={WEBSITE_ADMIN_NAV} userLabel={label} userRole={session?.role ?? ""}>
        {children}
      </ErpChrome>
    </div>
  );
}
