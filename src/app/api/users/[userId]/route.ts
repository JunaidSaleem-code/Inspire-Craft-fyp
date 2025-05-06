// users/[id]/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import { getSession } from "next-auth/react";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, {params}: {params: {userId: string}}) {
  try {
    await connectDB();
    const userId = params.userId;
    const user = await User.findById(userId)
    .select("-password")
    .populate("following", "username avatar")
    .populate("followers", "username avatar");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const session = await getSession({ req });
  if (!session || session.user.id !== req.query.userId)
    return res.status(403).json({ message: "Unauthorized" });

  const { email, password } = req.body;
  const updateData:{ email: string; password?: string } = { email };
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(req.query.userId, updateData, { new: true });
  return res.status(200).json(updatedUser);
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const session = await getSession({ req });
  if (!session || session.user.id !== req.query.userId)
    return res.status(403).json({ message: "Unauthorized" });

  await User.findByIdAndDelete(req.query.userId);
  return res.status(200).json({ message: "User deleted" });
}
