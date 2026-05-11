import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import { SupplierModel } from "@/lib/db/models/Supplier";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok, zodFail } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  address: z.string().max(500).optional(),
  gstNumber: z.string().max(30).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  const suppliers = await SupplierModel.find({}).sort({ name: 1 }).lean();
  return ok({ suppliers });
}

export async function POST(req: Request) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) return zodFail(parsed.error);

  await connectToDatabase();
  const created = await SupplierModel.create({
    name: parsed.data.name.trim(),
    phone: parsed.data.phone?.trim(),
    address: parsed.data.address?.trim(),
    gstNumber: parsed.data.gstNumber?.trim(),
    notes: parsed.data.notes?.trim(),
    status: parsed.data.status ?? "active",
  });

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SUPPLIER_CREATE",
    entityType: "Supplier",
    entityId: String(created._id),
    newValue: created.toObject(),
  }).catch(() => null);

  return ok({ supplier: created }, { status: 201 });
}
