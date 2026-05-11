import { cookies } from "next/headers";
import { ok } from "@/lib/http/apiResponse";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth/cookies";

export async function POST() {
  const jar = await cookies();
  jar.set(AUTH_COOKIE.accessToken, "", { ...getAuthCookieOptions(), maxAge: 0 });
  return ok({ done: true });
}

