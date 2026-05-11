import { PageHeader } from "@/components/erp/PageHeader";
import { ErpSimpleCategories } from "@/components/erp/ErpSimpleCategories";
import { getSessionFromServerCookies } from "@/lib/auth/session";

export default async function ErpCategoriesPage() {
  const session = await getSessionFromServerCookies();
  return (
    <>
      <PageHeader title="Categories" description="Name, status, and slug for organizing inventory." />
      <ErpSimpleCategories role={session?.role ?? ""} />
    </>
  );
}
