import { PageHeader } from "@/components/erp/PageHeader";
import { ErpProductsTable } from "@/components/erp/ErpProductsTable";

export default async function StockPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const sp = (await searchParams) ?? {};
  const initialSearch = typeof sp.q === "string" ? sp.q : "";

  return (
    <>
      <PageHeader title="Stock" description="Available quantity, low and out-of-stock flags." />
      <ErpProductsTable initialSearch={initialSearch} />
    </>
  );
}
