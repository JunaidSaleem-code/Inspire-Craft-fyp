import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { messageId } = params;
    const { emoji } = await req.json();
    if (!emoji) {
      return NextResponse.json({ error: 'Emoji required' }, { status: 400 });
    }
    await connectDB();
    // Find the message and verify it exists
    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    // Check if user has already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r: { user: Types.ObjectId; emoji: string }) => r.user.toString() === session.user.id && r.emoji === emoji
    );
    if (existingReaction) {
      // Remove the reaction
      message.reactions = message.reactions.filter(
        (r: { user: Types.ObjectId; emoji: string }) => !(r.user.toString() === session.user.id && r.emoji === emoji)
      );
    } else {
      // Add the reaction
      message.reactions.push({
        user: session.user.id,
        emoji
      });
    }
    await message.save();
    const populatedMessage = await message.populate('senderId', 'username avatar');
    return NextResponse.json(populatedMessage);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
