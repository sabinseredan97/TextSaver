import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
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
    const independentNoteId = params.independentNoteId; //parseInt(params.noteId);

    const note = await prisma.IndependentNotes.findUnique({
      where: { id: independentNoteId },
    });

    if (!note) throw new Error();

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 404 });
  }
}
