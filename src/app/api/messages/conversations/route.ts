import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    await connectDB();
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username avatar')
      .sort({ updatedAt: -1 });
    // Attach last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          conversationId: conv._id,
          isUnsent: false
        })
          .sort({ timestamp: -1 })
          .select('content type senderId timestamp');
        return {
          ...conv.toObject(),
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            type: lastMessage.type,
            senderId: lastMessage.senderId,
            timestamp: lastMessage.timestamp
          } : null
        };
      })
    );
    return NextResponse.json(conversationsWithLastMessage);
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
    const body = await req.json();
    const { participants, type = 'direct', name, avatar } = body;
    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json({ error: 'Invalid participants' }, { status: 400 });
    }
    await connectDB();
    // For direct messages, check if conversation already exists
    if (type === 'direct' && participants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: 'direct',
        participants: { $all: participants }
      }).populate('participants', 'username avatar');
      if (existingConversation) {
        return NextResponse.json(existingConversation);
      }
    }
    // Create new conversation
    const conversation = await Conversation.create({
      participants,
      type,
      name,
      avatar,
      isGroup: type === 'group',
      admins: type === 'group' ? [session.user.id] : undefined
    });
    const populatedConversation = await conversation.populate('participants', 'username avatar');
    return NextResponse.json(populatedConversation);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
