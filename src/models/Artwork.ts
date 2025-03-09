import mongoose, { Schema, model, models } from "mongoose";

export const ARTWORK_DIMENSIONS = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 566 },
} as const;

export interface IArtwork {
  _id?: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  thumbnailUrl?: string;
  price: number;
  currency: "PKR";
  isSold: boolean;
  buyer?: mongoose.Types.ObjectId;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const artworkSchema = new Schema<IArtwork>(
  {
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String, required: true }, // Can be an image or a video
    mediaType: { type: String, enum: ["image", "video"], required: true },
    thumbnailUrl: { type: String }, // Only for videos
    price: { type: Number, required: true },
    currency: { type: String, enum: ["PKR"], default: "PKR" },
    isSold: { type: Boolean, default: false },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    transformation: {
      height: { type: Number, default: ARTWORK_DIMENSIONS.square.height },
      width: { type: Number, default: ARTWORK_DIMENSIONS.square.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Artwork = models?.Artwork || model<IArtwork>("Artwork", artworkSchema);

export default Artwork;
