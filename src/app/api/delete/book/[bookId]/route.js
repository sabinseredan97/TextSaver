import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUser } from "@/services/api";
import { prisma } from "@/db";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    const bookId = parseInt(params.bookId);
    //throw new Error("Error!");

    const user = await getUser(session.user.email);
    console.log(bookId);

    const book = await prisma.Book.findFirst({
      where: { AND: [{ id: bookId, userId: user.id }] },
      orderBy: { id: "desc" },
    });

    if (!book) throw new Error("Not Found");

    await prisma.Notes.deleteMany({ where: { bookId: bookId } });

    await prisma.ChaptersVerses.deleteMany({ where: { bookId: bookId } });

    await prisma.Book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Book Deleted!" });
  } catch (error) {
    throw new Error("Error!");
  }
}
