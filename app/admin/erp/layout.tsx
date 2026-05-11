import { AdminShell } from "@/components/admin/AdminShell";

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      title="Super Admin ERP"
      nav={[
        { href: "/admin/erp", label: "Dashboard" },
        { href: "/admin/erp/users", label: "Users" },
        { href: "/admin/erp/purchases", label: "Purchases" },
        { href: "/admin/erp/sales", label: "Sales" },
        { href: "/admin/erp/stock", label: "Stock" },
        { href: "/admin/erp/audit", label: "Audit logs" },
      ]}
    >
      {children}
    </AdminShell>
  );
}

