import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: {
    promise: Promise<typeof mongoose> | null;
    conn: typeof mongoose | null;
  } | null;
}

const globalForMongoose = globalThis as typeof globalThis & {
  __mongooseConn?: {
    promise: Promise<typeof mongoose> | null;
    conn: typeof mongoose | null;
  };
};

const cached =
  globalForMongoose.__mongooseConn ?? (globalForMongoose.__mongooseConn = { promise: null, conn: null });

export async function connectToDatabase() {
  // Backwards-compatible wrapper. Use connectMongo() directly in new code.
  const conn = await connectMongo();
  // keep existing cached.* behavior for callers relying on it
  cached.conn = conn;
  return conn;
}

