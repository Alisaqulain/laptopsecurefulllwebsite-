import "./erp.css";
import { ErpChrome } from "@/components/erp/ErpChrome";
import { SUPER_ERP_NAV } from "@/lib/erp/nav";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { Toaster } from "sonner";

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromServerCookies();
  const label = session?.name?.trim() || session?.id || "User";

  return (
    <div className="erp-skin text-foreground">
      <Toaster richColors position="top-center" />
      <ErpChrome title="ERP" nav={SUPER_ERP_NAV} userLabel={label} userRole={session?.role ?? ""}>
        {children}
      </ErpChrome>
    </div>
  );
}
