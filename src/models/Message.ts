import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'emoji';
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
  replyTo?: Types.ObjectId;
  isUnsent: boolean;
  isEdited: boolean;
}

const MessageSchema: Schema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'video', 'voice', 'emoji'], default: 'text' },
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
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  isUnsent: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false }
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema); 