import { PageHeader } from "@/components/erp/PageHeader";
import { UdhariListTable } from "@/components/erp/UdhariListTable";

export default function SalesUdhariPage() {
  return (
    <>
      <PageHeader
        title="Udhari / Credit"
        description="Customers who owe money on past sales. Enter payment amount and tap Clear to reduce balance."
      />
      <UdhariListTable />
    </>
  );
}
