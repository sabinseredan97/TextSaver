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
    const chaptersVersesId = params.chaptersVersesId; //parseInt(params.bookId);

    await prisma.Notes.deleteMany({
      where: { chaptersversesId: chaptersVersesId },
    });

    await prisma.ChaptersVerses.delete({
      where: { id: chaptersVersesId },
    });

    return NextResponse.json({ message: "Chapter Deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
