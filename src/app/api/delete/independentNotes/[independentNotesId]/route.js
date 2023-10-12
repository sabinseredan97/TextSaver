import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
  }

  try {
    const independentNoteId = params.independentNotesId; //parseInt(params.noteId);

    await prisma.IndependentNotes.delete({ where: { id: independentNoteId } });

    return NextResponse.json({ message: "Note Deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
