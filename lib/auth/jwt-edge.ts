import { jwtVerify } from "jose";
import { z } from "zod";

/** Same claims as `signAccessToken` in `jwt.ts` — Edge-safe verify for middleware. */
const JwtPayloadSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  sub: z.string().optional(),
  role: z.string(),
  name: z.string().optional(),
});

export type JwtPayloadEdge = z.infer<typeof JwtPayloadSchema>;

export async function verifyAccessTokenEdge(token: string): Promise<JwtPayloadEdge | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const key = new TextEncoder().encode(secret);
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: process.env.JWT_ISSUER || "LaptopSecure",
      audience: process.env.JWT_AUDIENCE || "LaptopSecureERP",
    });
    const parsed = JwtPayloadSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
