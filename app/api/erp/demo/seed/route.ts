import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { seedDemoErp } from "@/lib/erp/demoSeed";

/** Uses cookies + Mongo; never static-cache. Long seed can exceed default serverless limits on hosts. */
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  try {
    const result = await seedDemoErp(auth.session.userId);
    return ok({ message: "Demo data created.", result }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Seed failed";
    if (msg === "DEMO_PRODUCT_LOOKUP_FAILED") {
      return fail("Demo seed could not resolve products for sample sales. Check server logs.", { status: 500, code: "DEMO_SEED_FAILED" });
    }
    return fail(msg || "Demo seed failed", { status: 500, code: "DEMO_SEED_FAILED" });
  }
}
