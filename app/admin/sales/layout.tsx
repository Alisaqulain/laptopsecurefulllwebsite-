import { AdminShell } from "@/components/admin/AdminShell";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      title="Sales Entry"
      nav={[
        { href: "/admin/sales", label: "Create bill" },
        { href: "/admin/sales/history", label: "Sales history" },
      ]}
    >
      {children}
    </AdminShell>
  );
}

