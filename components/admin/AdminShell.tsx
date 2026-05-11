"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function AdminShell(props: { title: string; nav: NavItem[]; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="glass-strong premium-border rounded-2xl">
          <div className="flex flex-col gap-6 p-5 md:flex-row">
            <aside className="md:w-64">
              <div className="text-xs font-medium text-muted-foreground">LaptopSecure</div>
              <div className="mt-1 text-lg font-semibold tracking-tight">{props.title}</div>
              <nav className="mt-5 space-y-1">
                {props.nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-electric-500/15 text-white ring-1 ring-electric-500/30"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 text-xs text-muted-foreground">
                <Link href="/admin" className="hover:text-foreground">
                  ← Back to portals
                </Link>
              </div>
            </aside>

            <section className="min-w-0 flex-1">{props.children}</section>
          </div>
        </div>
      </div>
    </div>
  );
}

