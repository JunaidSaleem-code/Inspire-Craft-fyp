import mongoose, { Schema, model, models } from "mongoose";

export const AI_IMAGE_DIMENSIONS = {
  default: { width: 1024, height: 1024 },
} as const;

export interface IGeneratedImage {
  user: mongoose.Types.ObjectId; // Owner of the image
  prompt: string; // The input prompt used for generation
  mediaUrl: string; // The generated image URL
  // thumbnailUrl?: string;
  isPublic: boolean; // Default is false, stays private
  source: string;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

const generatedImageSchema = new Schema<IGeneratedImage>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    // thumbnailUrl: { type: String },
    isPublic: { type: Boolean, default: false }, // Image stays private unless made public
    source: { type: String, default: "DALL·E 3" }, // Source of the generated image
    transformation: {
      height: { type: Number, default: AI_IMAGE_DIMENSIONS.default.height },
      width: { type: Number, default: AI_IMAGE_DIMENSIONS.default.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true }
);

generatedImageSchema.index({ prompt: "text" });


const GeneratedImage =
  models?.GeneratedImage || model<IGeneratedImage>("GeneratedImage", generatedImageSchema);

export default GeneratedImage;

// usage Example
// 1. Creating a New AI-Generated Image
// const newImage = await GeneratedImage.create({ user: userId, prompt: "A futuristic city", imageUrl: "image_url_here", isPublic: true, source: "DALL·E 3" });
// 2. Finding AI-Generated Image by ID
// const image = await GeneratedImage.findById(imageId);
// 3. Finding All Public AI-Generated Images
// const publicImages = await GeneratedImage.find({ isPublic: true });
// 4. Updating the Public Status of an Image
// const updatedImage = await GeneratedImage.findByIdAndUpdate(imageId, { isPublic: true }, { new: true });
// 5. Adding a Thumbnail to an Existing Image
// const imageWithThumbnail = await GeneratedImage.findByIdAndUpdate(imageId, { thumbnailUrl: "thumbnail_url_here" }, { new: true });
// 6. Finding Images by Source (e.g., DALL·E 3)
// const dalleImages = await GeneratedImage.find({ source: "DALL·E 3" });
// 7. Deleting an AI-Generated Image
// const deletedImage = await GeneratedImage.findByIdAndDelete(imageId);
