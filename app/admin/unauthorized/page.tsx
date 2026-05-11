import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-4">
        <div className="glass-strong premium-border w-full rounded-2xl p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn’t have permission to access this module.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild variant="secondary">
              <Link href="/admin">Go to admin home</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/login">Sign in as another user</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

