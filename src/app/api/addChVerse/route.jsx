import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/db";
import { getBookByUserId, getUser } from "@/services/api";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }
  try {
    const { chapter, verse, bookId, note } = await req.json();

    const user = await getUser(session.user.email);

    const book = prisma.Book.findFirst({
      where: { AND: [{ id: bookId, userId: user.id }] },
      orderBy: { id: "desc" },
    });
    if (!book) throw new Error("Unauthorised");

    await prisma.ChaptersVerses.create({
      data: {
        chapter: chapter,
        verses: verse,
        bookId: parseInt(bookId),
      },
    });

    const prismachapters = await prisma.ChaptersVerses.findFirst({
      where: {
        AND: [{ bookId: parseInt(bookId), chapter: chapter, verses: verse }],
      },
    });

    await prisma.Notes.create({
      data: {
        text: note,
        chaptersversesId: prismachapters.id,
        bookId: parseInt(bookId),
      },
    });

    return NextResponse.json({ message: "Success!" });
  } catch (error) {
    throw new Error("Error!");
  }
}
