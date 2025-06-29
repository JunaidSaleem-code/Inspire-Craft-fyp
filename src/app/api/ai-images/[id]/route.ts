import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GeneratedImage from "@/models/GeneratedImage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
  const  {id}  = params;
  console.log("Request for image ID:", id);

  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const image = await GeneratedImage.findById(id).populate("user");

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    if (!image.isPublic && image.user.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json( image);
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
