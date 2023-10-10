import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/db";
import { getUser } from "@/services/api";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    const { noteId, editedNote } = await req.json();

    await prisma.Notes.update({
      where: { id: parseInt(noteId) },
      data: { text: editedNote },
    });

    return NextResponse.json({ message: "Success!" });
  } catch (error) {
    throw new Error("Error");
  }
}
