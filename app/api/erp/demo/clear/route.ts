import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { ok } from "@/lib/http/apiResponse";
import { clearDemoData } from "@/lib/erp/demoSeed";

export const dynamic = "force-dynamic";

export async function POST() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await clearDemoData();
  return ok({ message: "Demo data removed." });
}
