import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUser } from "@/services/api";
import { prisma } from "@/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    const user = await getUser(session.user.email);

    const books = await prisma.Book.findMany({
      where: {
        userId: user.id,
      },
      include: {
        chaptersverses: true,
        notes: true,
      },
      orderBy: { id: "desc" },
    });

    if (!books) throw new Error("Nothing Found");

    return NextResponse.json(books);
  } catch (error) {
    throw new Error("Nothing Found");
  }
}
