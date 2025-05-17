import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import Like from "@/models/Like";



// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const artwork = await Artwork.findById(params.id).populate("artist", "email").lean();
//     if (!artwork) return NextResponse.json({ success: false, message: "Artwork not found" }, { status: 404 });

//     return NextResponse.json({ success: true, data: artwork });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Failed to fetch artwork" }, { status: 500 });
//   }
// }
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const artwork = await Artwork.findById(params.id).populate("artist", "email username avatar").lean();
    if (!artwork) return NextResponse.json({ success: false, message: "Artwork not found" }, { status: 404 });

    const likes = await Like.find({ artwork: params.id }).populate("user", "username email avatar").lean();

    return NextResponse.json({ success: true,  ...artwork, likes  });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch artwork", error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const artwork = await Artwork.findById(params.id);
    if (!artwork) return NextResponse.json({ success: false, message: "Artwork not found" }, { status: 404 });


    // Delete from MongoDB
    await Artwork.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: "Artwork deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete artwork", error }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, description, transformation, price } = body;

    const artwork = await Artwork.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(transformation && { transformation }),
        ...(price && { price }),
      },
      { new: true }
    ).populate("artist", "email");

    if (!artwork) {
      return NextResponse.json({ success: false, message: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true,  artwork });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update artwork" }, { status: 500 });
  }
}
