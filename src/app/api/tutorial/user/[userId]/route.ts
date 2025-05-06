import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Tutorial from '@/models/Tutorial';

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const tutorials = await Tutorial.find({ author: params.userId }).sort({ createdAt: -1 });
    return NextResponse.json(tutorials, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch tutorials', error }, { status: 500 });
  }
}
