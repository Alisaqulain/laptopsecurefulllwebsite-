import { RoleKey, type RoleKey as RoleKeyType } from "@/lib/auth/roles";

export function isRole(role: string, allowed: RoleKeyType[]) {
  return allowed.includes(role as RoleKeyType);
}

export function canAccessPortal(role: string, portal: "website" | "erp" | "sales") {
  if (role === RoleKey.SUPER_ADMIN) return true;
  if (portal === "website") return role === RoleKey.WEBSITE_ADMIN;
  if (portal === "sales") return role === RoleKey.SALES_ADMIN;
  // erp portal is super-admin only (by design)
  return false;
}

