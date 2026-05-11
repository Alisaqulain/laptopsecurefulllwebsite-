import { PageHeader } from "@/components/erp/PageHeader";
import { ErpProductsTable } from "@/components/erp/ErpProductsTable";

export default function SalesStockPage() {
  return (
    <>
      <PageHeader title="Stock check" description="SKU, attributes, and quantity — view only. Amounts are not shown on this screen." />
      <ErpProductsTable showCost={false} showSellingPrice={false} readOnly />
    </>
  );
}
