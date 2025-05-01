import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all artworks
export async function GET() {
  await connectDB();
  const artworks = await Artwork.find({}).populate("artist", "email");
  return NextResponse.json(artworks);
}

// POST new artwork
export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const artwork = await Artwork.create({ ...body, artist: session.user.id });
    return NextResponse.json(artwork, { status: 201 });
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE an artwork (only owner)
export async function DELETE(req : NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const artwork = await Artwork.findById(id);
  if (!artwork || artwork.artist.toString() !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await Artwork.findByIdAndDelete(id);
  return NextResponse.json({ message: "Artwork deleted" });
}

// Like an artwork
export async function PUT(req : NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { artworkId } = await req.json();
  const artwork = await Artwork.findById(artworkId);
  if (!artwork) return NextResponse.json({ error: "Artwork not found" }, { status: 404 });

  const hasLiked = artwork.likes.includes(session.user.id);
  if (hasLiked) {
    artwork.likes.pull(session.user.id);
  } else {
    artwork.likes.push(session.user.id);
  }
  await artwork.save();

  return NextResponse.json({ likes: artwork.likes.length });
}
