import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getUser } from "@/services/server-actions";
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
    const noteId = params.noteId; //parseInt(params.noteId);

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

    if (!book) throw new Error();

    return NextResponse.json({ note, book }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 404 });
  }
}
