import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }
    await connectDB();
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: session.user.id
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    // Get messages
    const messages = await Message.find({
      conversationId,
      isUnsent: false
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'username avatar');
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await req.formData();
    const conversationId = formData.get('conversationId') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string;
    const media = formData.get('media') as File | null;
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }
    await connectDB();
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: session.user.id
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    let mediaUrl = '';
    let mediaType = '';
    // Handle media upload (implement if you have a media service)
    // if (media) { ... }
    // Create message
    const message = await Message.create({
      conversationId,
      senderId: session.user.id,
      content: content || '',
      type: media ? mediaType : type,
      media: media ? {
        url: mediaUrl,
        type: mediaType
      } : undefined,
      seenBy: [session.user.id]
    });
    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: content || '',
        senderId: session.user.id,
        timestamp: message.timestamp,
        type: media ? mediaType : type
      },
      $set: { updatedAt: new Date() }
    });
    const populatedMessage = await message.populate('senderId', 'username avatar');
    return NextResponse.json(populatedMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 