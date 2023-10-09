import { prisma } from "@/db";

export function getUser(email) {
  return prisma.User.findUnique({ where: { email: email } });
}
