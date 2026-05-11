import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { SaleModel } from "@/lib/db/models/Sale";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { fail, ok } from "@/lib/http/apiResponse";

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
