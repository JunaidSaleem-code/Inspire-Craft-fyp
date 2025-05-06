// /api/ai-images/[id]/visibility/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GeneratedImage from "@/models/GeneratedImage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;
    const { isPublic } = await req.json();

    const updatedImage = await GeneratedImage.findOneAndUpdate(
      { _id: id, user: userId },
      { isPublic },
      { new: true }
    );

    if (!updatedImage) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, image: updatedImage });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update visibility", error }, { status: 500 });
  }
}
