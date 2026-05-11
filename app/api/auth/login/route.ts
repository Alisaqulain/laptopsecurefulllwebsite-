import { z } from "zod";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth/cookies";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { rateLimit } from "@/lib/security/rateLimit";
import { getClientIp } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const ip = (await getClientIp()) ?? "unknown";
  const rl = rateLimit(`login:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return fail("Too many requests. Try again shortly.", { status: 429, code: "RATE_LIMIT" });

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const user = await UserModel.findOne({ email: parsed.data.email }).select("+password").lean();
  if (!user) {
    await writeAuditLog({
      actorUserId: null,
      actorRole: null,
      actorIp: ip,
      action: "AUTH_LOGIN_FAILED",
      entityType: "User",
      entityId: "000000000000000000000000",
      message: `Failed login for ${parsed.data.email}`,
      newValue: { email: parsed.data.email },
    }).catch(() => null);
    return fail("Invalid email or password", { status: 401, code: "INVALID_CREDENTIALS" });
  }
  if (user.isActive === false) return fail("Account disabled", { status: 403, code: "ACCOUNT_DISABLED" });

  const valid = await verifyPassword(parsed.data.password, user.password);
  if (!valid) {
    await writeAuditLog({
      actorUserId: String(user._id),
      actorRole: user.role,
      actorIp: ip,
      action: "AUTH_LOGIN_FAILED",
      entityType: "User",
      entityId: String(user._id),
      message: "Invalid password",
    }).catch(() => null);
    return fail("Invalid email or password", { status: 401, code: "INVALID_CREDENTIALS" });
  }

  const token = signAccessToken(
    { userId: String(user._id), email: user.email, role: user.role, name: user.name },
    "8h",
  );

  const jar = await cookies();
  jar.set(AUTH_COOKIE.accessToken, token, {
    ...getAuthCookieOptions(),
    maxAge: 60 * 60 * 8,
  });

  await UserModel.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } }).catch(() => null);
  await writeAuditLog({
    actorUserId: String(user._id),
    actorRole: user.role,
    actorIp: ip,
    action: "AUTH_LOGIN_SUCCESS",
    entityType: "User",
    entityId: String(user._id),
    message: "User logged in",
  }).catch(() => null);

  return ok({ user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
}

