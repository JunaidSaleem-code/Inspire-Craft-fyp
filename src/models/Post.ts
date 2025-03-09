import mongoose, { Schema, model, models } from "mongoose";

export const POST_DIMENSIONS = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 566 },
} as const;

export interface IPost {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  thumbnailUrl?: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const postSchema = new Schema<IPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String, required: true }, // Can be an image or a video
    mediaType: { type: String, enum: ["image", "video"], required: true },
    thumbnailUrl: { type: String }, // Only for videos
    controls: { type: Boolean, default: true }, // Only for videos
    transformation: {
      height: { type: Number, default: POST_DIMENSIONS.square.height },
      width: { type: Number, default: POST_DIMENSIONS.square.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = models?.Post || model<IPost>("Post", postSchema);

export default Post;
