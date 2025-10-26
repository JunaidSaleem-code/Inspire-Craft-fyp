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
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const contentType = req.headers.get('content-type');
    let conversationId: string;
    let content: string;
    let type: string;
    let sharedContent: {
      type: string;
      contentId: string;
      title: string;
      description?: string;
      mediaUrl: string;
      author: {
        id: string;
        username: string;
        avatar?: string;
      };
    } | null = null;
    let media: File | null;
    
    if (contentType?.includes('application/json')) {
      // JSON request (for shared content)
      const body = await req.json();
      conversationId = body.conversationId;
      content = body.content;
      type = body.type;
      sharedContent = body.sharedContent;
      media = null;
    } else {
      // Form data request (for regular messages)
      const formData = await req.formData();
      conversationId = formData.get('conversationId') as string;
      content = formData.get('content') as string;
      type = formData.get('type') as string;
      media = formData.get('media') as File | null;
      sharedContent = null;
    }
    
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
    
    const mediaUrl = '';
    const mediaType = '';
    // Handle media upload (implement if you have a media service)
    // if (media) { ... }
    
    // Create message with shared content support
    const message = await Message.create({
      conversationId,
      senderId: session.user.id,
      content: content || '',
      type: type || 'text',
      sharedContent: sharedContent || undefined,
      media: media ? {
        url: mediaUrl,
        type: mediaType
      } : undefined,
      seenBy: [session.user.id]
    });
    
    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: sharedContent ? `Shared a ${sharedContent.type}` : content || '',
        senderId: session.user.id,
        timestamp: message.timestamp,
        type: type || 'text'
      },
      $set: { updatedAt: new Date() }
    });
    
    const populatedMessage = await message.populate('senderId', 'username avatar');
    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error('Message POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
