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
    const { chapterVersesId, editedData } = await req.json();

    await prisma.ChaptersVerses.update({
      where: { id: chapterVersesId /*parseInt(noteId)*/ },
      data: { chapter: editedData.chapter, verses: editedData.verses },
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
