import { PageHeader } from "@/components/erp/PageHeader";
import { ErpSimpleSuppliers } from "@/components/erp/ErpSimpleSuppliers";

export default function SuppliersPage() {
  return (
    <>
      <PageHeader title="Suppliers" description="Who you buy from — and their purchase history." />
      <ErpSimpleSuppliers />
    </>
  );
}
