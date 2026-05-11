import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";

const JwtPayloadSchema = z.object({
  // new payload (spec)
  userId: z.string().optional(),
  email: z.string().email().optional(),
  // backward-compat
  sub: z.string().optional(),
  role: z.string(),
  name: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
  iss: z.string().optional(),
  aud: z.union([z.string(), z.array(z.string())]).optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET env var");
  return secret;
}

export function signAccessToken(payload: Omit<JwtPayload, "iat" | "exp">, expiresIn: string = "8h") {
  const options: SignOptions = {
    expiresIn: expiresIn as any,
    issuer: process.env.JWT_ISSUER || "LaptopSecure",
    audience: process.env.JWT_AUDIENCE || "LaptopSecureERP",
  };
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      issuer: process.env.JWT_ISSUER || "LaptopSecure",
      audience: process.env.JWT_AUDIENCE || "LaptopSecureERP",
    });
    const parsed = JwtPayloadSchema.safeParse(decoded);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

