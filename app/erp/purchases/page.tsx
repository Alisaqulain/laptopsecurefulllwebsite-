import { PageHeader } from "@/components/erp/PageHeader";
import { PurchasePageBody } from "@/components/erp/PurchasePageBody";

export default function PurchaseEntryPage() {
  return (
    <>
      <PageHeader title="Purchase entry" description="Select supplier, add lines — stock increases when you save." />
      <PurchasePageBody />
    </>
  );
}
