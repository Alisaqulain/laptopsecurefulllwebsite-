import { redirect } from "next/navigation";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { RoleKey } from "@/lib/auth/roles";
import AdminLoginPage from "@/app/admin/login/page";

export default async function LoginPage(props: { searchParams?: Promise<{ next?: string }> }) {
  const session = await getSessionFromServerCookies();
  const sp = (await props.searchParams) ?? {};
  const nextUrl = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "";

  if (session) {
    const byRole =
      session.role === RoleKey.SUPER_ADMIN
        ? "/erp/dashboard"
        : session.role === RoleKey.WEBSITE_ADMIN
          ? "/website-admin/dashboard"
          : session.role === RoleKey.SALES_ADMIN
            ? "/sales/dashboard"
            : "/admin";
    redirect(nextUrl || byRole);
  }

  return <AdminLoginPage />;
}

