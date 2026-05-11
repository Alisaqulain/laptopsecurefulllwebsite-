import { PageHeader } from "@/components/erp/PageHeader";
import { SalesEntryForm } from "@/components/erp/SalesEntryForm";
import { getSessionFromServerCookies } from "@/lib/auth/session";
import { RoleKey } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function ErpSalesEntryPage() {
  const session = await getSessionFromServerCookies();
  if (session?.role === RoleKey.SALES_ADMIN) {
    redirect("/sales/new-sale");
  }
  return (
    <>
      <PageHeader
        title="Sales"
        description="Record a new sale below, then browse all invoices with view, printable download, or delete (delete restores stock)."
      />
      <SalesEntryForm />
    </>
  );
}
