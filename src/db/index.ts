// src/db/index.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use a global variable so that Prisma client is not recreated during hot reloads in dev
export const db =
  global.prisma ||
  new PrismaClient({
    log: ["query", "warn", "error"], // optional
  });

if (process.env.NODE_ENV !== "production") global.prisma = db;

export default db;
