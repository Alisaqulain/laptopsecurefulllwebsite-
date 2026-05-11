import { PageHeader } from "@/components/erp/PageHeader";
import { DeletedSalesLogTable } from "@/components/erp/DeletedSalesLogTable";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { RoleKey } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DeletedSalesPage() {
  const session = await getSessionFromServerCookies();
  if (!session) redirect("/login");
  if (session.role !== RoleKey.SUPER_ADMIN) redirect("/erp/dashboard");

  return (
    <>
      <PageHeader title="Deleted sales log" description="Restore deleted invoices or permanently remove them." />
      <DeletedSalesLogTable />
    </>
  );
}

