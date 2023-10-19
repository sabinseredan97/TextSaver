import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUser } from "@/services/server-actions";
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
    const bookId = params.bookId; //parseInt(params.bookId);
    //throw new Error("Error!");

    const user = await getUser(session.user.email);

    const book = await prisma.Book.findFirst({
      where: { AND: [{ id: bookId, userId: user.id }] },
      orderBy: { createdAt: "desc" },
    });

    if (!book) throw new Error();

    await prisma.Notes.deleteMany({ where: { bookId: bookId } });

    await prisma.ChaptersVerses.deleteMany({ where: { bookId: bookId } });

    await prisma.Book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Book Deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
