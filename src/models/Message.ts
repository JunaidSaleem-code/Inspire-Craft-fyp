import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'emoji' | 'shared';
  timestamp: Date;
  reactions: {
    user: Types.ObjectId;
    emoji: string;
  }[];
  seenBy: Types.ObjectId[];
  deliveredTo: Types.ObjectId[];
  media?: {
    url: string;
    type: string;
    aspectRatio?: number;
    duration?: number;
  };
  sharedContent?: {
    type: 'post' | 'artwork' | 'tutorial';
    contentId: Types.ObjectId;
    title: string;
    description?: string;
    mediaUrl: string;
    author: {
      id: Types.ObjectId;
      username: string;
      avatar?: string;
    };
  };
  replyTo?: Types.ObjectId;
  isUnsent: boolean;
  isEdited: boolean;
}

const MessageSchema: Schema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'video', 'voice', 'emoji', 'shared'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  reactions: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String },
    },
  ],
  seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  deliveredTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  media: {
    url: { type: String },
    type: { type: String },
    aspectRatio: { type: Number },
    duration: { type: Number },
  },
  sharedContent: {
    type: { type: String, enum: ['post', 'artwork', 'tutorial'] },
    contentId: { type: Schema.Types.ObjectId },
    title: { type: String },
    description: { type: String },
    mediaUrl: { type: String },
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'User' },
      username: { type: String },
      avatar: { type: String }
    }
  },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  isUnsent: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false }
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema); 