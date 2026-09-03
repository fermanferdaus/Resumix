import { PrismaClient } from "@prisma/client";
import { appConfig } from "./app.js";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: appConfig.nodeEnv === "development" ? ["warn", "error"] : ["error"],
  });

if (appConfig.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
