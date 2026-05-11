import { PageHeader } from "@/components/erp/PageHeader";
import { ErpProductsTable } from "@/components/erp/ErpProductsTable";

export default function SalesStockPage() {
  return (
    <>
      <PageHeader title="Stock check" description="Selling price and quantity — view only." />
      <ErpProductsTable showCost={false} readOnly />
    </>
  );
}
