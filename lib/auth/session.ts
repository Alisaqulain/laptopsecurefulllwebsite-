import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { verifyAccessTokenEdge } from "@/lib/auth/jwt-edge";
import { AUTH_COOKIE } from "@/lib/auth/cookies";

export type SessionUser = {
  id: string;
  role: string;
  name?: string;
};

/**
 * Middleware runs on the Edge runtime — `jsonwebtoken` does not work there.
 * Use `jose` so the session is recognized and protected routes do not redirect-loop with `/login`.
 */
export async function getSessionFromNextRequest(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(AUTH_COOKIE.accessToken)?.value;
  if (!token) return null;
  const payload = await verifyAccessTokenEdge(token);
  const id = payload?.userId ?? payload?.sub;
  if (!id || !payload?.role) return null;
  return { id, role: payload.role, name: payload.name };
}

export async function getSessionFromServerCookies(): Promise<SessionUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE.accessToken)?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  const id = payload?.userId ?? payload?.sub;
  if (!id || !payload?.role) return null;
  return { id, role: payload.role, name: payload.name };
}

export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return h.get("x-real-ip");
}

