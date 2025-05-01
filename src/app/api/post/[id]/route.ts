// app/post/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import mongoose from 'mongoose';
import Like from '@/models/Like';

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function GET(request:Request, { params }: { params: { id: string } }) {
  await connectDB();
  const  {id}  = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const [post, likes] = await Promise.all([
      Post.findById(id).populate('user').lean(),
      Like.find({ post: id }).populate('user', 'name email image').lean(),
    ]);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...post, likes }}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   await connectDB();

//   const { id } = params;

//   if (!isValidObjectId(id)) {
//     console.log('Invalid post ID');
//     return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
//   }

//   try {
//     const body = await req.json();
//     const updated = await Post.findByIdAndUpdate(id, body, { new: true });

//     if (!updated) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updated }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
//   }
// }

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  console.log('id', id);

  if (!isValidObjectId(id)) {
    console.log('Invalid post ID');
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Only update fields that exist in the request body
    const updates: any = {};
    if (body.title) updates.title = body.title;
    if (body.description) updates.description = body.description;
    if (body.mediaUrl) updates.mediaUrl = body.mediaUrl;

    const updatedPost = await Post.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPost }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
