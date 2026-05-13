import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { PurchaseModel } from "@/lib/db/models/Purchase";
import { ProductModel } from "@/lib/db/models/Product";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

type DeletedSnap = { invoiceNumber?: string; totals?: { finalTotal?: number } };

/** Soft-delete purchase and reduce stock that was added when the bill was saved. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();

  const session = await mongoose.startSession();
  let snap: DeletedSnap | null = null;
  try {
    snap = await session.withTransaction(async () => {
      const purchase = await PurchaseModel.findOne({ _id: id, deletedAt: null }).session(session);
      if (!purchase) throw new Error("NOT_FOUND");

      for (const item of purchase.items ?? []) {
        const pid = item.productId as Types.ObjectId;
        const qty = item.quantity ?? 0;
        if (qty <= 0) continue;
        const product = await ProductModel.findById(pid).session(session).lean();
        const onHand = product?.stock?.onHand ?? 0;
        if (onHand < qty) throw new Error("INSUFFICIENT_STOCK");
        await ProductModel.findByIdAndUpdate(pid, { $inc: { "stock.onHand": -qty } }, { session });
      }

      await PurchaseModel.findByIdAndUpdate(
        id,
        {
          deletedAt: new Date(),
          deletedByUserId: new Types.ObjectId(auth.session.userId),
        },
        { session },
      );

      return purchase.toObject() as DeletedSnap;
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NOT_FOUND") return fail("Purchase not found or already removed", { status: 404, code: "NOT_FOUND" });
    if (msg === "INSUFFICIENT_STOCK") {
      return fail(
        "Cannot remove this purchase: not enough stock on hand for one or more lines (items may have been sold). Adjust stock or delete related sales first.",
        { status: 409, code: "INSUFFICIENT_STOCK" },
      );
    }
    return fail("Could not delete purchase", { status: 500, code: "DELETE_FAILED" });
  } finally {
    await session.endSession();
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "PURCHASE_DELETE",
    entityType: "Purchase",
    entityId: id,
    newValue: snap
      ? {
          invoiceNumber: snap.invoiceNumber ?? "",
          deletedAt: new Date(),
          amount: snap.totals?.finalTotal ?? 0,
        }
      : undefined,
  }).catch(() => null);

  return ok({ deleted: true });
}
