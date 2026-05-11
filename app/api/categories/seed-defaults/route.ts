import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/Category";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { DEFAULT_ERP_CATEGORIES } from "@/lib/inventory/defaultErpCategories";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

/** Creates the four stock ERP categories (with field schemas) when missing or empty. Idempotent. */
export async function POST() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();

  const uid = new mongoose.Types.ObjectId(auth.session.userId);
  const created: string[] = [];
  const updated: string[] = [];

  for (const seed of DEFAULT_ERP_CATEGORIES) {
    const existing = await CategoryModel.findOne({ slug: seed.slug }).lean();
    if (!existing) {
      const doc = await CategoryModel.create({
        name: seed.name,
        slug: seed.slug,
        sortOrder: seed.sortOrder,
        status: seed.status,
        fieldDefinitions: seed.fieldDefinitions,
        createdByUserId: uid,
      });
      created.push(String(doc._id));
      continue;
    }
    const defs = existing.fieldDefinitions as unknown[] | undefined;
    if (!defs || defs.length === 0) {
      await CategoryModel.updateOne(
        { _id: existing._id },
        { $set: { fieldDefinitions: seed.fieldDefinitions, sortOrder: seed.sortOrder } },
      );
      updated.push(String(existing._id));
    }
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "CATEGORY_SEED_DEFAULTS",
    entityType: "Category",
    entityId: "batch",
    message: `seed-defaults: created ${created.length}, filled empty schemas ${updated.length}`,
  }).catch(() => null);

  return ok({ created: created.length, updatedSchemas: updated.length });
}
