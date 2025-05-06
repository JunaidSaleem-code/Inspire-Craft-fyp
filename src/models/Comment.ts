import mongoose, { Schema, model, models } from "mongoose";

export interface IComment {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  commentableType: "tutorial" | "post" | "artwork";
  commentableId: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    commentableType: {
      type: String,
      enum: ["tutorial", "post", "artwork"],
      required: true,
    },
    commentableId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Comment = models?.Comment || model<IComment>("Comment", commentSchema);

export default Comment;
