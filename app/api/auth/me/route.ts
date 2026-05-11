import { ok } from "@/lib/http/apiResponse";
import { getSessionFromServerCookies } from "@/lib/auth/session";

export async function GET() {
  const session = await getSessionFromServerCookies();
  return ok({ session });
}

