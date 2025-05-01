// /api/ai-images/public/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GeneratedImage from "@/models/GeneratedImage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();
  
  try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      const images = await GeneratedImage.find({ isPublic: true }).sort({ createdAt: -1 });
      console.log('images', images);
      return NextResponse.json({ success: true, images });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Failed to fetch images" }, { status: 500 });
    }
}
