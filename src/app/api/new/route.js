import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/db";
import { getUser } from "@/services/api";
import { validateData } from "@/services/dataValidator";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
  }
  try {
    const user = await getUser(session.user.email);
    const { book, chapter, verse, note } = await req.json();

    validateData(book);
    validateData(chapter);
    validateData(note);

    await prisma.Book.create({
      data: {
        name: book,
        userId: user.id,
      },
    });

    const prismaBook = await prisma.Book.findFirst({
      where: { name: book, userId: user.id },
    });

    await prisma.ChaptersVerses.create({
      data: {
        chapter: chapter,
        verses: verse,
        bookId: prismaBook.id,
      },
    });

    const prismaChaptersVerses = await prisma.ChaptersVerses.findFirst({
      where: { bookId: prismaBook.id, chapter: chapter, verses: verse },
      orderBy: { id: "desc" },
    });

    await prisma.Notes.create({
      data: {
        text: note,
        bookId: prismaBook.id,
        chaptersversesId: prismaChaptersVerses.id,
      },
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
