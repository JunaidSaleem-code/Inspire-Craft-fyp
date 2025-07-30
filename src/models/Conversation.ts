import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    senderId: Types.ObjectId;
    timestamp: Date;
    type: string;
  };
  isGroup: boolean;
  admins?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  name: { type: String },
  avatar: { type: String },
  lastMessage: {
    content: { type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date },
    type: { type: String }
  },
  isGroup: { type: Boolean, default: false },
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema); 