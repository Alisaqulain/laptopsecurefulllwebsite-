import { PageHeader } from "@/components/erp/PageHeader";
import { SalesEntryForm } from "@/components/erp/SalesEntryForm";

export default function SalesNewSalePage() {
  return (
    <>
      <PageHeader title="New sale" description="Search product, confirm stock, bill customer." />
      <SalesEntryForm />
    </>
  );
}
