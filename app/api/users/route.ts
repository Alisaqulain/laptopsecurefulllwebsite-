import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { hashPassword } from "@/lib/auth/password";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";
import { getClientIp } from "@/lib/auth/session";

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(10).max(200),
  phone: z.string().max(30).optional(),
  profileImage: z.string().url().optional(),
  role: z.enum([RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN]),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const users = await UserModel.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).limit(500).lean();
  return ok({ users });
}

export async function POST(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();
  const existing = await UserModel.findOne({ email: parsed.data.email.toLowerCase().trim() }).lean();
  if (existing) return fail("Email already exists", { status: 409, code: "DUPLICATE_EMAIL" });

  const passwordHash = await hashPassword(parsed.data.password);
  const created = await UserModel.create({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase().trim(),
    password: passwordHash,
    phone: parsed.data.phone ?? "",
    profileImage: parsed.data.profileImage ?? "",
    role: parsed.data.role,
    isActive: parsed.data.isActive ?? true,
  });

  const ip = (await getClientIp()) ?? null;
  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    actorIp: ip,
    action: "USER_CREATE",
    entityType: "User",
    entityId: String(created._id),
    newValue: created.toObject(),
  });

  return ok({ user: created }, { status: 201 });
}

