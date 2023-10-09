import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    const { chaptersversesId, bookId, note } = await req.json();

    await prisma.Notes.create({
      data: {
        text: note,
        chaptersversesId: parseInt(chaptersversesId),
        bookId: parseInt(bookId),
      },
    });

    return NextResponse.json({ message: "Success!" });
  } catch (error) {
    throw new Error("Error!");
  }
}
