import { z } from "zod";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { hashPassword } from "@/lib/auth/password";
import { RoleKey } from "@/lib/auth/roles";
import { rateLimit } from "@/lib/security/rateLimit";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";
import { getClientIp } from "@/lib/auth/session";

// Body kept for forward-compat; currently not required for default bootstrap.
const BodySchema = z.object({}).passthrough();

const DEFAULT_USERS = [
  {
    role: RoleKey.SUPER_ADMIN,
    name: "LaptopSecure Super Admin",
    email: "superadmin@laptopsecure.in",
    password: "superadmin@1234",
  },
  {
    role: RoleKey.SALES_ADMIN,
    name: "LaptopSecure Sales Staff",
    email: "sell@laptopsecure.in",
    password: "sell@1234",
  },
  {
    role: RoleKey.WEBSITE_ADMIN,
    name: "LaptopSecure Website Manager",
    email: "website@laptopsecure.in",
    password: "website@1234",
  },
] as const;

export async function POST(req: Request) {
  const token = req.headers.get("x-bootstrap-token");
  const expected = process.env.BOOTSTRAP_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { success: false, message: "Bootstrap not configured" },
      { status: 500 },
    );
  }
  if (!token || token !== expected) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit("bootstrap", { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 422 });
  }

  await connectToDatabase();

  const superExists = await UserModel.findOne({ role: RoleKey.SUPER_ADMIN }).lean();
  if (superExists) {
    return NextResponse.json({ success: false, message: "Bootstrap already completed" }, { status: 409 });
  }

  const existingAny = await UserModel.findOne({ email: { $in: DEFAULT_USERS.map((u) => u.email) } }).lean();
  if (existingAny) {
    // extra safety: even if count is 0/rare, block if any default email is taken
    return NextResponse.json({ success: false, message: "Bootstrap already completed" }, { status: 409 });
  }

  const passwordHashes = await Promise.all(DEFAULT_USERS.map((u) => hashPassword(u.password)));
  const created = await UserModel.insertMany(
    DEFAULT_USERS.map((u, idx) => ({
      name: u.name,
      email: u.email.toLowerCase().trim(),
      password: passwordHashes[idx],
      role: u.role,
      phone: "",
      profileImage: "",
      isActive: true,
    })),
  );

  const ip = (await getClientIp()) ?? null;
  await writeAuditLog({
    actorUserId: null,
    actorRole: "SYSTEM",
    actorIp: ip,
    action: "BOOTSTRAP_CREATE_DEFAULT_USERS",
    entityType: "User",
    entityId: String(created[0]?._id ?? "000000000000000000000000"),
    newValue: created.map((u) => ({ id: String(u._id), email: u.email, role: u.role })),
    message: "Created default SUPER_ADMIN / SALES_ADMIN / WEBSITE_ADMIN accounts",
  }).catch(() => null);

  return NextResponse.json(
    {
      success: true,
      message: "Bootstrap completed",
      users: created.map((u) => ({ id: String(u._id), email: u.email, role: u.role })),
    },
    { status: 201 },
  );
}

