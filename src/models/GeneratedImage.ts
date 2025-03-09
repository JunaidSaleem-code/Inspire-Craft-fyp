import mongoose, { Schema, model, models } from "mongoose";

export const AI_IMAGE_DIMENSIONS = {
  default: { width: 1024, height: 1024 },
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 566 },
} as const;

export interface IGeneratedImage {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // Owner of the image
  prompt: string; // The input prompt used for generation
  imageUrl: string; // The generated image URL
  thumbnailUrl?: string;
  isPublic: boolean; // Default is false, stays private
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
}

const generatedImageSchema = new Schema<IGeneratedImage>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    isPublic: { type: Boolean, default: false }, // Image stays private unless made public
    transformation: {
      height: { type: Number, default: AI_IMAGE_DIMENSIONS.square.height },
      width: { type: Number, default: AI_IMAGE_DIMENSIONS.square.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true }
);

const GeneratedImage =
  models?.GeneratedImage || model<IGeneratedImage>("GeneratedImage", generatedImageSchema);

export default GeneratedImage;
