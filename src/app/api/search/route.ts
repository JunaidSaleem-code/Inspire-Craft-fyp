import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Artwork from "@/models/Artwork";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ message: "Search query is required" }, { status: 400 });
  }

  try {
    const users = await User.find({ $text: { $search: query } }).limit(5);
    const artworks = await Artwork.find({ $text: { $search: query }, isPublic: true }).limit(5);

    return NextResponse.json({ users, artworks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}

// GET http://localhost:3000/api/search?query=sunset
