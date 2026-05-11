import { PageHeader } from "@/components/erp/PageHeader";
import { ErpSettingsForm } from "@/components/erp/ErpSettingsForm";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Shop name, GST, and invoice wording." />
      <ErpSettingsForm />
    </>
  );
}
