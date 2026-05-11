import "../../erp/erp.css";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="erp-skin min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <div className="text-sm font-medium text-muted-foreground">LaptopSecure</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Staff sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your assigned account. You will only see modules you are allowed to access.
            </p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}

