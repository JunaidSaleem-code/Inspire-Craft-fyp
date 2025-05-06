import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import GeneratedImage from '@/models/GeneratedImage';

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const {userId} = params
    const images = await GeneratedImage.find({ user: userId }).sort({ createdAt: -1 });
    console.log('images', images);
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch AI images', error }, { status: 500 });
  }
}
