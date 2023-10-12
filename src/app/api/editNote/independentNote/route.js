import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  try {
    const { independentNoteId, editedNote } = await req.json();

    await prisma.IndependentNotes.update({
      where: { id: independentNoteId /*parseInt(noteId)*/ },
      data: { text: editedNote },
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
