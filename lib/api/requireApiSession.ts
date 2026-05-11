import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { fail } from "@/lib/http/apiResponse";

export type ApiSession = {
  userId: string;
  role: string;
  name?: string;
};

export async function requireApiSession(opts?: { roles?: string[] }) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE.accessToken)?.value;
  if (!token) return { ok: false as const, response: fail("Unauthorized", { status: 401, code: "UNAUTHORIZED" }) };

  const payload = verifyAccessToken(token);
  const userId = payload?.userId ?? payload?.sub;
  if (!userId || !payload?.role) {
    return { ok: false as const, response: fail("Unauthorized", { status: 401, code: "UNAUTHORIZED" }) };
  }

  if (opts?.roles && !opts.roles.includes(payload.role)) {
    return { ok: false as const, response: fail("Forbidden", { status: 403, code: "FORBIDDEN" }) };
  }

  return {
    ok: true as const,
    session: { userId, role: payload.role, name: payload.name } satisfies ApiSession,
  };
}

