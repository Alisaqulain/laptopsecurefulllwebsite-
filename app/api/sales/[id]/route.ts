import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { SaleModel } from "@/lib/db/models/Sale";
import { ProductModel } from "@/lib/db/models/Product";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";
import { writeAuditLog } from "@/lib/audit/writeAuditLog";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();
  const sale = await SaleModel.findOne({ _id: id, deletedAt: null }).lean();

  if (!sale) return fail("Not found", { status: 404, code: "NOT_FOUND" });

  return ok({ sale });
}

/** Soft-delete sale and put quantity back on stock. Both SUPER_ADMIN and SALES_ADMIN can delete any sale. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid id", { status: 400, code: "BAD_ID" });

  await connectToDatabase();

  const session = await mongoose.startSession();
  let deletedSale: any | null = null;
  try {
    await session.withTransaction(async () => {
      const sale = await SaleModel.findOne({ _id: id, deletedAt: null }).session(session);
      if (!sale) throw new Error("NOT_FOUND");

      for (const item of sale.items ?? []) {
        const pid = item.productId as Types.ObjectId;
        const qty = item.quantity ?? 0;
        if (qty <= 0) continue;
        await ProductModel.findByIdAndUpdate(
          pid,
          { $inc: { "stock.onHand": qty, "stock.sold": -qty } },
          { session },
        );
      }

      await SaleModel.findByIdAndUpdate(
        id,
        {
          deletedAt: new Date(),
          deletedByUserId: new Types.ObjectId(auth.session.userId),
          deleteReason: auth.session.role === RoleKey.SALES_ADMIN ? "Deleted by Sales Admin" : "Deleted by Super Admin",
        },
        { session },
      );

      deletedSale = sale.toObject();
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NOT_FOUND") return fail("Sale not found or already removed", { status: 404, code: "NOT_FOUND" });
    return fail("Could not delete sale", { status: 500, code: "DELETE_FAILED" });
  } finally {
    await session.endSession();
  }

  await writeAuditLog({
    actorUserId: auth.session.userId,
    actorRole: auth.session.role,
    action: "SALE_DELETE",
    entityType: "Sale",
    entityId: id,
    newValue: deletedSale
      ? {
          invoiceNumber: deletedSale.invoiceNumber,
          deletedAt: new Date(),
          customer: deletedSale.customerSnapshot?.name ?? "",
          amount: deletedSale.totals?.finalTotal ?? 0,
        }
      : undefined,
  }).catch(() => null);

  return ok({ deleted: true });
}
