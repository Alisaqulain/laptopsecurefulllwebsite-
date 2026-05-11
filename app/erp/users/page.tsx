import { PageHeader } from "@/components/erp/PageHeader";
import { ErpUserManagement } from "@/components/erp/ErpUserManagement";

export default function ErpUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Staff accounts and roles." />
      <ErpUserManagement />
    </>
  );
}
