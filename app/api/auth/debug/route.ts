import { cookies } from "next/headers";
import { ok } from "@/lib/http/apiResponse";
import { AUTH_COOKIE } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE.accessToken)?.value ?? null;
  const payload = token ? verifyAccessToken(token) : null;
  return ok({
    hasCookie: Boolean(token),
    cookieName: AUTH_COOKIE.accessToken,
    payload,
  });
}

