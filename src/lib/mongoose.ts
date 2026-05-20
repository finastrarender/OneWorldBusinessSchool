import mongoose from "mongoose";
import { env } from "@/env";

declare global {
  var mongooseConn: { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null };
}

const g = globalThis as typeof globalThis & {
  mongooseConn?: { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null };
};

if (!g.mongooseConn) {
  g.mongooseConn = { promise: null, conn: null };
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (g.mongooseConn!.conn) {
    return g.mongooseConn.conn;
  }
  if (!g.mongooseConn!.promise) {
    g.mongooseConn!.promise = mongoose.connect(env.MONGODB_URI).then(() => mongoose);
  }
  g.mongooseConn!.conn = await g.mongooseConn!.promise;
  return g.mongooseConn!.conn;
}
