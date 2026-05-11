import { PageHeader } from "@/components/erp/PageHeader";
import { ErpProductsTable } from "@/components/erp/ErpProductsTable";

export default function WebsiteAdminProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Website catalog: selling price, stock on hand, and status. Purchase cost is hidden."
      />
      <ErpProductsTable showCost={false} />
    </>
  );
}
