import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongodb";
import { ok, fail } from "@/lib/http/apiResponse";

export async function GET() {
  try {
    await connectMongo();
    return ok({
      connected: mongoose.connection.readyState === 1,
      db: mongoose.connection.name,
    });
  } catch (e) {
    return fail("DB connection failed", {
      status: 503,
      code: "DB_UNAVAILABLE",
      details: e instanceof Error ? e.message : String(e),
    });
  }
}

