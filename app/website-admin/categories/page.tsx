import { PageHeader } from "@/components/erp/PageHeader";
import { ErpCategoryManager } from "@/components/erp/ErpCategoryManager";
import { getSessionFromServerCookies } from "@/lib/auth/session";

export default async function WebsiteAdminCategoriesPage() {
  const session = await getSessionFromServerCookies();
  return (
    <>
      <PageHeader
        title="Categories"
        description="Define category field schemas — the storefront and ERP use the same category records."
      />
      <ErpCategoryManager role={session?.role ?? ""} />
    </>
  );
}
