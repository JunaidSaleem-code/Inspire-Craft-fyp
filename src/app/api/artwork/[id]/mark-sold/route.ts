import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const artwork = await Artwork.findByIdAndUpdate(
      params.id,
      { isSold: true },
      { new: true }
    );

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Artwork marked as sold", artwork });
  } catch (error) {
    console.error("Error marking as sold:", error);
    return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 });
  }
}
