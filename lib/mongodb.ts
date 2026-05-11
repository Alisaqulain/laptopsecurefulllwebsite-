import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __lsMongo: {
    promise: Promise<typeof mongoose> | null;
    conn: typeof mongoose | null;
    loggedConnected: boolean;
  } | null;
}

const globalForMongo = globalThis as typeof globalThis & {
  __lsMongo?: { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null; loggedConnected: boolean };
};

const cached = globalForMongo.__lsMongo ?? (globalForMongo.__lsMongo = { promise: null, conn: null, loggedConnected: false });

export async function connectMongo() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "laptopsecure";
  if (!uri) throw new Error("Missing MONGODB_URI env var");

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName,
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
      })
      .then((m) => {
        if (!cached.loggedConnected) {
          cached.loggedConnected = true;
          // eslint-disable-next-line no-console
          console.log(`[MongoDB Connected] db=${m.connection.name}`);
        }
        return m;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[MongoDB Error]", err);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

