import type { Metadata } from "next";
import "./erp.css";
import { ErpChrome } from "@/components/erp/ErpChrome";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import { RoleKey } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { SALES_NAV, SUPER_ERP_NAV, WEBSITE_ADMIN_NAV } from "@/lib/erp/nav";

/** Avoid marketing tagline (“Buy • Sell…”) in browser tab for staff ERP pages. */
export const metadata: Metadata = {
  title: {
    default: "ERP",
    template: `%s | ${siteConfig.name} Stock`,
  },
};

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromServerCookies();
  if (!session) redirect("/login");
  // Hard role boundaries:
  // - SUPER_ADMIN uses /erp/*
  // - SALES_ADMIN uses /sales/*
  // - WEBSITE_ADMIN uses /website-admin/*
  if (session.role === RoleKey.SALES_ADMIN) redirect("/sales/dashboard");
  if (session.role === RoleKey.WEBSITE_ADMIN) redirect("/website-admin/dashboard");

  const label = session?.name?.trim() || session?.id || "User";
  const nav = session?.role === RoleKey.SUPER_ADMIN ? SUPER_ERP_NAV : session?.role === RoleKey.SALES_ADMIN ? SALES_NAV : WEBSITE_ADMIN_NAV;

  return (
    <div className="erp-skin text-foreground">
      <Toaster richColors position="top-center" />
      <ErpChrome title="ERP" nav={nav} userLabel={label} userRole={session?.role ?? ""}>
        {children}
      </ErpChrome>
    </div>
  );
}
