import { PageHeader } from "@/components/erp/PageHeader";
import { SalesEntryForm } from "@/components/erp/SalesEntryForm";

export default function ErpSalesEntryPage() {
  return (
    <>
      <PageHeader title="Sales entry" description="Fast billing workflow with stock check and draft invoice actions." />
      <SalesEntryForm />
    </>
  );
}
