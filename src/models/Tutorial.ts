import mongoose, { Schema, model, models } from "mongoose";

export const TUTORIAL_DIMENSIONS = {
  width: 1080,
  height: 566,
  
} as const;

export interface ITutorial {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

const tutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: TUTORIAL_DIMENSIONS.height },
      width: { type: Number, default: TUTORIAL_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true }
);

const Tutorial = models?.Tutorial || model<ITutorial>("Tutorial", tutorialSchema);

export default Tutorial;
