import { PageHeader } from "@/components/erp/PageHeader";
import { ErpProductsTable } from "@/components/erp/ErpProductsTable";

export default function StockPage() {
  return (
    <>
      <PageHeader title="Stock" description="Available quantity, low and out-of-stock flags." />
      <ErpProductsTable />
    </>
  );
}
