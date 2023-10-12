import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/db";
import { getUser } from "@/services/api";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
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
        bookId: bookId, //parseInt(bookId),
      },
    });

    const prismachapters = await prisma.ChaptersVerses.findFirst({
      where: {
        AND: [{ bookId: bookId, chapter: chapter, verses: verse }],
      },
    });

    await prisma.Notes.create({
      data: {
        text: note,
        chaptersversesId: prismachapters.id,
        bookId: bookId,
      },
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
