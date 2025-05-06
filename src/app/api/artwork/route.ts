import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    
    const artworks = await Artwork.find({}).populate("artist", "email").lean();
    
    
    if (!artworks.length) {
      return NextResponse.json({ success: false, message: "No artworks found" }, { status: 404 });
    }

    return NextResponse.json( artworks );
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch artworks" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    const { title, description, mediaUrl, mediaFileId, mediaType, price } = await req.json();

    console.log("Received artwork data:", { title, description, mediaUrl, mediaFileId, mediaType, price });

    if (!mediaUrl || !mediaFileId) {
      return NextResponse.json({ success: false, message: "Missing mediaUrl or fileId" }, { status: 400 });
    }

    const artwork = new Artwork({
      artist: session.user.id,
      title,
      description,
      mediaUrl,  
      mediaFileId,    
      mediaType,
      price,
    });

    await artwork.save();

    return NextResponse.json({ success: true, artwork });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create artwork", error }, { status: 500 });
  }
}

