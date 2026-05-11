import { AdminShell } from "@/components/admin/AdminShell";

export default function WebsiteAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      title="Website Admin"
      nav={[
        { href: "/admin/website", label: "Dashboard" },
        { href: "/admin/website/products", label: "Products" },
        { href: "/admin/website/categories", label: "Categories" },
      ]}
    >
      {children}
    </AdminShell>
  );
}

