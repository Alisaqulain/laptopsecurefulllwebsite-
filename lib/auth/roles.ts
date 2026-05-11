export const RoleKey = {
  WEBSITE_ADMIN: "WEBSITE_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  SALES_ADMIN: "SALES_ADMIN",
} as const;

export type RoleKey = (typeof RoleKey)[keyof typeof RoleKey];

export const ALL_ROLE_KEYS: RoleKey[] = [
  RoleKey.WEBSITE_ADMIN,
  RoleKey.SUPER_ADMIN,
  RoleKey.SALES_ADMIN,
];

