import { PageHeader } from "@/components/erp/PageHeader";
import { PurchasePageBody } from "@/components/erp/PurchasePageBody";

export default function PurchaseEntryPage() {
  return (
    <>
      <PageHeader
        title="Purchases"
        description="Start from your supplier list, then open purchase entry to record stock inward."
      />
      <PurchasePageBody />
    </>
  );
}
