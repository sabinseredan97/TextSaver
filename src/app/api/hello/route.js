import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req, res) {
  return res.status(202).json({ message: "Salutari" });
}
