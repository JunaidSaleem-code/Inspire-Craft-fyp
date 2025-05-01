import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Your NextAuth config
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;
  const profileUserId = params.userId;

  if (!mongoose.Types.ObjectId.isValid(profileUserId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (currentUserId === profileUserId) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const profileUser = await User.findById(profileUserId);

    if (!currentUser || !profileUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAlreadyFollowing = currentUser.following.includes(profileUser._id);

    if (isAlreadyFollowing) {
      await currentUser.unfollow(profileUser._id);
      await profileUser.removeFollower(currentUser._id);
    } else {
      await currentUser.follow(profileUser._id);
      await profileUser.addFollower(currentUser._id);
    }

    return NextResponse.json({
      isFollowing: !isAlreadyFollowing,
      followerCount: profileUser.followers.length,
    });
  } catch (error) {
    console.error("Follow toggle error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
