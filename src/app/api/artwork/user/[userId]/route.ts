import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Artwork from '@/models/Artwork';

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB();
    const { userId } = await params;
    const artworks = await Artwork.find({ artist: userId }).sort({ createdAt: -1 });
    return NextResponse.json(artworks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch artworks', error }, { status: 500 });
  }
}
