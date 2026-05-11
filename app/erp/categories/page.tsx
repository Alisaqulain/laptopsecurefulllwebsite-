import { PageHeader } from "@/components/erp/PageHeader";
import { ErpCategoryManager } from "@/components/erp/ErpCategoryManager";
import { getSessionFromServerCookies } from "@/lib/auth/session";

export default async function ErpCategoriesPage() {
  const session = await getSessionFromServerCookies();
  return (
    <>
      <PageHeader
        title="Categories"
        description="Each category defines its own field schema. Purchases and stock use those fields — add new electronics types without code changes."
      />
      <ErpCategoryManager role={session?.role ?? ""} />
    </>
  );
}
