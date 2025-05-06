import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Comment, { IComment } from "@/models/Comment";
import Artwork from "@/models/Artwork";
import Post from "@/models/Post";
import Tutorial from "@/models/Tutorial";

type PopulatedUser = {
  _id: string;
  name: string;
  avatar?: string;
};

type PopulatedComment = Omit<IComment, "user"> & {
  user: PopulatedUser;
  _id: string;
};

const categoryModelMap = {
  artwork: Artwork,
  post: Post,
  tutorial: Tutorial,
};

type CategoryType = keyof typeof categoryModelMap;

// GET: Fetch top-level comments (no replies)
export async function GET(req: NextRequest, { params }: { params: { category: string; id: string } }) {
  try {
    const { category, id } = params;
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    await connectDB();

    const Comments = await Comment.find({
      commentableType: category,
      commentableId: new mongoose.Types.ObjectId(id),
    })
      .populate("user", "name _id avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<PopulatedComment[]>();

    const totalCount = await Comment.countDocuments({
      commentableType: category,
      commentableId: new mongoose.Types.ObjectId(id),
    });

    return NextResponse.json({ success: true, comments: Comments, totalCount });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch comments.", error }, { status: 500 });
  }
}

// POST: Create a new comment (no replies)
export async function POST(req: NextRequest, { params }: { params: { category: string; id: string } }) {
  try {
    await connectDB();
    const { category, id } = params;
    const { comment } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    const newComment = await Comment.create({
      user: user.id,
      content: comment,
      commentableType: category,
      commentableId: new mongoose.Types.ObjectId(id),
      parentComment: null,
    });

    // Push the new comment to the associated content model (artwork, post, or tutorial)
    const Model = categoryModelMap[category as CategoryType];
    if (Model) {
      await Model.findByIdAndUpdate(id, {
        $push: { comments: newComment._id },
      });
    }

    return NextResponse.json({ success: true, comment: newComment });
  } catch (err) {
    console.error("CREATE COMMENT ERROR:", err);
    return NextResponse.json({ success: false, message: "Failed to create comment." }, { status: 500 });
  }
}

// PATCH: Update a comment (no replies)
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { commentId, content } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    const existing = await Comment.findById(commentId);

    if (!existing) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    if (existing.user.toString() !== user.id.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    existing.content = typeof content === "string" ? content : content?.content || JSON.stringify(content);

    await existing.save();

    return NextResponse.json({ success: true, updated: existing });
  } catch (err) {
    console.error("UPDATE COMMENT ERROR:", err);
    return NextResponse.json({ success: false, message: "Failed to update comment." }, { status: 500 });
  }
}

// DELETE: Remove a comment
export async function DELETE(req: NextRequest, { params }: { params: { category: string } }) {
  try {
    await connectDB();
    const { commentId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    if (comment.user.toString() !== user.id.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const category = params.category as CategoryType;
    const Model = categoryModelMap[category];
    if (Model) {
      await Model.findByIdAndUpdate(comment.commentableId, {
        $pull: { comments: comment._id },
      });
    }

    await Comment.deleteOne({ _id: comment._id });

    return NextResponse.json({ success: true, message: "Comment deleted." });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return NextResponse.json({ success: false, message: "Failed to delete comment." }, { status: 500 });
  }
}
