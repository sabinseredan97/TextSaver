import { prisma } from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export function getUser(email) {
  return prisma.User.findUnique({ where: { email: email } });
}

export async function getAllBoks() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error();
    }

    const user = await getUser(session.user.email);

    return prisma.Book.findMany({
      where: {
        userId: user.id,
      },
      include: {
        chaptersverses: true,
        notes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return error;
  }
}
