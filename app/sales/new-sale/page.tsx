import { PageHeader } from "@/components/erp/PageHeader";
import { SalesEntryForm } from "@/components/erp/SalesEntryForm";

export default function SalesNewSalePage() {
  return (
    <>
      <PageHeader
        title="New sale"
        description="Pick the item and quantity — pricing is applied from the office list when you save (not shown on this screen)."
      />
      <SalesEntryForm salesPortal />
    </>
  );
}
