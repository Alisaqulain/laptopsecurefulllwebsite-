import { PageHeader } from "@/components/erp/PageHeader";
import { SalesListTable } from "@/components/erp/SalesListTable";

export default function SalesInvoicesPage() {
  return (
    <>
      <PageHeader title="Invoices" description="Your sales invoices — view, print, search, or delete your own entries." />
      <SalesListTable mode="sales" />
    </>
  );
}
