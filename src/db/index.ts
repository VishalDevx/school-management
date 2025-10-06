// src/db/index.ts
import { PrismaClient } from "@prisma/client";

// Ensure singleton across hot reloads in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  global.prisma ||
  new PrismaClient({
    log: ["query", "warn", "error"], // optional, helps with debugging
  });

if (process.env.NODE_ENV !== "production") global.prisma = db;

export default db;
