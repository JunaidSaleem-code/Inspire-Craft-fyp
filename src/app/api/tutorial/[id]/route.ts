import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tutorial from "@/models/Tutorial";
import Like from "@/models/Like";

// GET /api/tutorial/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } =  await params;
  
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }
    const [tutorial, likes] = await Promise.all([
      Tutorial.findById(id).populate('author', 'username email avatar').lean(),
      Like.find({ tutorial: id }).populate('user', 'name email avatar').lean(),
    ]);
   
    if (!tutorial) {
      return NextResponse.json({ message: "Tutorial not found" }, { status: 404 });
    }
  
  
    return NextResponse.json({ success: true,  ...tutorial,
       likes 
      }, { status: 200 });
  }catch (error) {
    console.error("Error fetching tutorial:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/tutorial/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } =  await params;

    const tutorial = await Tutorial.findById(id);
    console.log('tutorial',tutorial);
    if (!tutorial) {
      return NextResponse.json({ message: "Tutorial not found" }, { status: 404 });
    }

    await Tutorial.findByIdAndDelete(id);
    return NextResponse.json({success: true, message: "Tutorial deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// PATCH /api/tutorial/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } =  await params;
    const { title, description, category } = await req.json();

    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const tutorial = await Tutorial.findById(id);
    if (!tutorial) {
      return NextResponse.json({ message: "Tutorial not found" }, { status: 404 });
    }

    // Update tutorial properties, but do not touch media
    tutorial.title = title ?? tutorial.title;
    tutorial.description = description ?? tutorial.description;
    tutorial.category = category ?? tutorial.category;

    // Save the updated tutorial
    await tutorial.save();

    return NextResponse.json({ message: "Tutorial updated successfully", tutorial }, { status: 200 });
  } catch (error) {
    console.error("Error updating tutorial:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}