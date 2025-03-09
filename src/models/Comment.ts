import mongoose, { Schema, model, models } from "mongoose";

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // User who commented
  content: string;
  parentComment?: mongoose.Types.ObjectId; // For threaded replies
  post?: mongoose.Types.ObjectId; // If it's on a post
  tutorial?: mongoose.Types.ObjectId; // If it's on a tutorial
  artwork?: mongoose.Types.ObjectId; // If it's on an artwork
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    post: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    tutorial: { type: Schema.Types.ObjectId, ref: "Tutorial", default: null },
    artwork: { type: Schema.Types.ObjectId, ref: "Artwork", default: null },
  },
  { timestamps: true }
);

const Comment = models?.Comment || model<IComment>("Comment", commentSchema);
export default Comment;
