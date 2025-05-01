import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/lib/db";
import Post from "@/models/Post";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().populate("user");
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }); 
    }
    const body = await req.json();
    const newPost = await Post.create({ ...body, user: session.user.id });
    return NextResponse.json({ success: true, data: newPost },{ status: 201 });
  } catch (error) {
    console.error("POST post error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
