import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const posts = await Post.find({ author: params.userId }).sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
