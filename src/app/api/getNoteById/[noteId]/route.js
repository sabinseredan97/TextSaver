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
    const noteId = parseInt(params.noteId);

    const user = await getUser(session.user.email);

    const note = await prisma.Notes.findUnique({
      where: { id: noteId },
    });

    const book = await prisma.Book.findFirst({
      where: { AND: [{ id: note.bookId, userId: user.Id }] },
      include: {
        chaptersverses: { where: { id: note.chaptersversesId } },
        // orderBy: { id: "desc" },
      },
      //orderBy: { chaptersversets: { id: "desc" } },
    });

    if (!book) throw new Error("Not Found");

    return NextResponse.json({ note, book });
  } catch (error) {
    throw new Error("Not Found");
  }
}
