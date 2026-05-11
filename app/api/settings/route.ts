import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import { SettingsModel } from "@/lib/db/models/Settings";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const PatchSchema = z.object({
  company: z
    .object({
      name: z.string().max(120).optional(),
      logoUrl: z.string().max(500).optional().nullable(),
      address: z.string().max(500).optional().nullable(),
      gstNumber: z.string().max(40).optional().nullable(),
      phone: z.string().max(40).optional().nullable(),
      email: z.string().max(120).optional().nullable(),
    })
    .optional(),
  invoice: z
    .object({
      terms: z.array(z.string().max(200)).max(20).optional(),
      signatureLabel: z.string().max(80).optional(),
      prefix: z.string().max(10).optional(),
    })
    .optional(),
});

export async function GET() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  let doc = await SettingsModel.findOne().lean();
  if (!doc) {
    await SettingsModel.create({});
    doc = await SettingsModel.findOne().lean();
  }
  return ok({ settings: doc });
}

export async function PATCH(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();
  let doc = await SettingsModel.findOne();
  if (!doc) doc = await SettingsModel.create({});

  const $set: Record<string, unknown> = {};
  if (parsed.data.company) {
    for (const [k, v] of Object.entries(parsed.data.company)) {
      if (v !== undefined) $set[`company.${k}`] = v;
    }
  }
  if (parsed.data.invoice) {
    for (const [k, v] of Object.entries(parsed.data.invoice)) {
      if (v !== undefined) $set[`invoice.${k}`] = v;
    }
  }

  const updated = await SettingsModel.findByIdAndUpdate(doc._id, { $set }, { new: true }).lean();
  if (!updated) return fail("Update failed", { status: 500, code: "UPDATE_FAILED" });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SETTINGS_UPDATE",
    entityType: "Settings",
    entityId: String(doc._id),
    newValue: updated,
  }).catch(() => null);

  return ok({ settings: updated });
}
