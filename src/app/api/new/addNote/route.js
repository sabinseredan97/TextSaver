import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
  }

  try {
    const { chaptersversesId, bookId, note } = await req.json();

    await prisma.Notes.create({
      data: {
        text: note,
        chaptersversesId: chaptersversesId, //parseInt(chaptersversesId),
        bookId: bookId, //parseInt(bookId),
      },
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
