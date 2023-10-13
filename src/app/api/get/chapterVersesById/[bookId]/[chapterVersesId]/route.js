import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { getUser } from "@/services/api";
import { prisma } from "@/db";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
  }

  try {
    const { bookId, chapterVersesId } = params; //parseInt(params.noteId);

    const user = await getUser(session.user.email);

    const book = await prisma.Book.findFirst({
      where: { AND: [{ id: bookId, userId: user.Id }] },
      include: {
        chaptersverses: { where: { id: chapterVersesId } },
        notes: { where: { chaptersversesId: chapterVersesId } },
      },
    });

    if (!book || book.chaptersverses.length < 1) throw new Error();

    /* const chaptersVerses = await prisma.ChaptersVerses.findUnique({
      where: { id: chaptersVersesId },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!chaptersVerses) throw new Error(); */

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 404 });
  }
}
