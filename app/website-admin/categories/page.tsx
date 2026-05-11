import { PageHeader } from "@/components/erp/PageHeader";
import { ErpSimpleCategories } from "@/components/erp/ErpSimpleCategories";
import { getSessionFromServerCookies } from "@/lib/auth/session";

export default async function WebsiteAdminCategoriesPage() {
  const session = await getSessionFromServerCookies();
  return (
    <>
      <PageHeader title="Categories" description="Storefront category names and visibility." />
      <ErpSimpleCategories role={session?.role ?? ""} />
    </>
  );
}
