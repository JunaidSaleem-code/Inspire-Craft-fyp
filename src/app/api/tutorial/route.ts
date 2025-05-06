import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tutorial from "@/models/Tutorial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const tutorials = await Tutorial.find()
      .populate("author", "email username avatar").sort({ createdAt: -1 }).lean();

    return NextResponse.json( tutorials );
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch tutorials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { title, description, mediaUrl,mediaFileId, } = await req.json(); 
    if (!title || !mediaUrl || !description || !mediaFileId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newTutorial = new Tutorial({
      title,
      description,
      mediaUrl,
      mediaFileId,
      author: session.user.id,
    });

    await newTutorial.save();

    return NextResponse.json({ success: true, tutorial: newTutorial });
  } catch (error) {
    console.error("Error creating tutorial:", error);
    return NextResponse.json({ success: false, message: "Failed to create tutorial" }, { status: 500 });
  }
}
