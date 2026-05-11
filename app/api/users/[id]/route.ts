import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { hashPassword } from "@/lib/auth/password";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";
import { getClientIp } from "@/lib/auth/session";

const UpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().max(30).optional(),
  profileImage: z.string().url().optional(),
  role: z.enum([RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN]).optional(),
  isActive: z.boolean().optional(),
});

const PasswordSchema = z.object({
  password: z.string().min(10).max(200),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invalid user id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const before = await UserModel.findById(id).lean();
  if (!before) return fail("User not found", { status: 404, code: "NOT_FOUND" });

  const updated = await UserModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();

  const ip = (await getClientIp()) ?? null;
  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    actorIp: ip,
    action: "USER_UPDATE",
    entityType: "User",
    entityId: id,
    oldValue: before,
    newValue: updated,
  });

  return ok({ user: updated });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  // password change endpoint
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invalid user id", { status: 400, code: "BAD_ID" });

  const json = await req.json().catch(() => null);
  const parsed = PasswordSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();

  const passwordHash = await hashPassword(parsed.data.password);
  const updated = await UserModel.findByIdAndUpdate(id, { $set: { password: passwordHash } }, { new: true }).lean();
  if (!updated) return fail("User not found", { status: 404, code: "NOT_FOUND" });

  const ip = (await getClientIp()) ?? null;
  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    actorIp: ip,
    action: "USER_PASSWORD_CHANGE",
    entityType: "User",
    entityId: id,
    message: "Password changed",
  });

  return ok({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invalid user id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();

  const before = await UserModel.findById(id).lean();
  if (!before) return fail("User not found", { status: 404, code: "NOT_FOUND" });

  await UserModel.deleteOne({ _id: id });

  const ip = (await getClientIp()) ?? null;
  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    actorIp: ip,
    action: "USER_DELETE",
    entityType: "User",
    entityId: id,
    oldValue: before,
  });

  return ok({ deleted: true });
}

