"use client";

import { usePathname } from "next/navigation";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { MarketplaceProvider } from "@/components/providers/MarketplaceProvider";
import { LayoutChrome } from "@/components/layout/LayoutChrome";

/**
 * Marketing site uses smooth scroll, custom cursor, and route transitions.
 * Admin portals (/erp, /sales, /website-admin) and staff login skip all of that for a plain, fast UI.
 */
const MINIMAL_CHROME_PREFIXES = [
  "/erp",
  "/sales",
  "/website-admin",
  "/login",
  "/unauthorized",
  "/admin",
] as const;

function useMinimalRootChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  return MINIMAL_CHROME_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function RootAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = useMinimalRootChrome(pathname);

  if (minimal) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <MarketplaceProvider>
      <LenisProvider>
        <LayoutChrome>
          <PageTransition>{children}</PageTransition>
        </LayoutChrome>
      </LenisProvider>
    </MarketplaceProvider>
  );
}
