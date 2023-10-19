import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/db";
import { getUser } from "@/services/server-actions";
import { validateData } from "@/services/dataValidator";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
  }
  try {
    const user = await getUser(session.user.email);
    const { title, note } = await req.json();

    validateData(title);
    validateData(note);

    await prisma.IndependentNotes.create({
      data: {
        userId: user.id,
        title: title,
        text: note,
      },
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error!" }, { status: 400 });
  }
}
