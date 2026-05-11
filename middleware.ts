import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromNextRequest } from "@/lib/auth/session";
import { canAccessPortal } from "@/lib/auth/rbac";

function isPublicFile(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  );
}

function portalForPath(pathname: string): "website" | "erp" | "sales" | null {
  if (pathname.startsWith("/admin/website")) return "website";
  if (pathname.startsWith("/admin/erp")) return "erp";
  if (pathname.startsWith("/admin/sales")) return "sales";
  if (pathname.startsWith("/website-admin")) return "website";
  if (pathname.startsWith("/erp")) return "erp";
  if (pathname.startsWith("/sales")) return "sales";
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublicFile(pathname)) return NextResponse.next();

  // Allow auth endpoints and login pages without a session.
  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname.startsWith("/admin/login") || pathname === "/login") return NextResponse.next();

  const portal = portalForPath(pathname);
  if (!portal) return NextResponse.next();

  const session = await getSessionFromNextRequest(req);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!canAccessPortal(session.role, portal)) {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/erp/:path*", "/website-admin/:path*", "/sales/:path*", "/login", "/unauthorized"],
};

