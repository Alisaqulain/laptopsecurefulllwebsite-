import { connectToDatabase } from "@/lib/db/connect";
import { SettingsModel } from "@/lib/db/models/Settings";
import { requireApiSession } from "@/lib/api/requireApiSession";
import { RoleKey } from "@/lib/auth/roles";
import { ok } from "@/lib/http/apiResponse";
import { buildInvoicePrintBranding } from "@/lib/invoice/printBranding";

/** Company + invoice copy for printable bills (no secrets). Sales and ERP staff only. */
export async function GET() {
  const auth = await requireApiSession({ roles: [RoleKey.SUPER_ADMIN, RoleKey.SALES_ADMIN] });
  if (!auth.ok) return auth.response;

  await connectToDatabase();
  let doc = await SettingsModel.findOne().lean();
  if (!doc) {
    await SettingsModel.create({});
    doc = await SettingsModel.findOne().lean();
  }

  return ok({ branding: buildInvoicePrintBranding(doc) });
}
