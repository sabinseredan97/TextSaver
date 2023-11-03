import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { getUser } from "@/services/server-actions";
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
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const skip = (page - 1) * limit;

    const user = await getUser(session.user.email);

    const independentNotes = await prisma.IndependentNotes.findMany({
      skip: skip,
      take: limit,
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!independentNotes || independentNotes.length === 0) throw new Error();

    return NextResponse.json(independentNotes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 404 });
  }
}
