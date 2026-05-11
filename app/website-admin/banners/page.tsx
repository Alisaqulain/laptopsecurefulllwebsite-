import { PageHeader } from "@/components/erp/PageHeader";
import { ErpComingSoon } from "@/components/erp/ErpComingSoon";

export default function WebsiteAdminBannersPage() {
  return (
    <>
      <PageHeader title="Homepage banners" description="Hero and promo slots for the marketing site." />
      <ErpComingSoon title="Banner manager">
        API for banner CRUD, ordering, and scheduling is not connected yet.
      </ErpComingSoon>
    </>
  );
}
