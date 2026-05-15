import { PageHeader } from "@/components/erp/PageHeader";
import { UdhariListTable } from "@/components/erp/UdhariListTable";

export default function ErpUdhariPage() {
  return (
    <>
      <PageHeader
        title="Udhari / Credit"
        description="Track customer credit and debt from partial payments. Record amounts when customers pay later."
      />
      <UdhariListTable />
    </>
  );
}
