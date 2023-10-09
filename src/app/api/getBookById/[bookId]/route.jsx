import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUser } from "@/services/api";
import { prisma } from "@/db";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    const bookId = parseInt(params.bookId);

    const user = await getUser(session.user.email);

    const book = await prisma.Book.findFirst({
      where: { AND: [{ id: bookId, userId: user.id }] },
      include: {
        chaptersverses: { orderBy: { id: "desc" } },
        // orderBy: { id: "desc" },
        notes: { orderBy: { id: "desc" } },
        //orderBy: { id: "desc" },
      },
      orderBy: { id: "desc" },
    });

    if (!book) throw new Error("Not Found");

    return NextResponse.json(book);
  } catch (error) {
    throw new Error("Not Found");
  }
}
