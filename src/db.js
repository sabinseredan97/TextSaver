/* import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma */

import { PrismaClient } from "@prisma/client"

const globalForPrisma = global

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"]
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/* "use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var globalForPrisma = global;
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: ["query"],
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma; */