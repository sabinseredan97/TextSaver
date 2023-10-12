import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUser } from "@/services/api";
import { prisma } from "@/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
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
      orderBy: { createdAt: "desc" },
    });

    if (!books || books.length === 0) throw new Error();

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 404 });
  }
}
