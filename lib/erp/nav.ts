export type ErpNavItem = { href: string; label: string };

/** Super admin — laptop trading inventory only */
export const SUPER_ERP_NAV: ErpNavItem[] = [
  { href: "/erp/dashboard", label: "Dashboard" },
  { href: "/erp/categories", label: "Categories" },
  { href: "/erp/suppliers", label: "Suppliers" },
  { href: "/erp/purchases", label: "Purchase Entry" },
  { href: "/erp/sales", label: "Sales Entry" },
  { href: "/erp/stock", label: "Stock" },
  { href: "/erp/users", label: "Users" },
  { href: "/erp/settings", label: "Settings" },
];

export const SALES_NAV: ErpNavItem[] = [
  { href: "/sales/dashboard", label: "Dashboard" },
  { href: "/sales/new-sale", label: "New Sale" },
  { href: "/sales/stock", label: "Stock Check" },
];

/** Website storefront catalog */
export const WEBSITE_ADMIN_NAV: ErpNavItem[] = [
  { href: "/website-admin/dashboard", label: "Dashboard" },
  { href: "/website-admin/products", label: "Products" },
  { href: "/website-admin/categories", label: "Categories" },
  { href: "/website-admin/banners", label: "Banners" },
];
