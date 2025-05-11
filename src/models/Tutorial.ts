import mongoose, { Schema ,CallbackError } from 'mongoose';
import imagekit from '@/lib/imagekit';


export interface ITutorial {
  author: mongoose.Types.ObjectId;
  title: string;
  description: string;
  mediaFileId?: string;
  mediaUrl: string;
  comments: mongoose.Types.ObjectId[];
}

const TutorialSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    mediaFileId:{type: String},
  mediaUrl: {type:String ,require:true},
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

TutorialSchema.index({ title: "text", description: "text" });


TutorialSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Find the document to be deleted
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      // Clean up likes related to this post
      const res = await mongoose.model('Like').deleteMany({ tutorial: doc._id });
      console.log('Associated likes deleted',res);
      
      // Clean up comments if needed (optional)
      await mongoose.model("Comment").deleteMany({ tutorial: doc._id });
      
      // Delete the associated media from ImageKit
      if (doc.mediaFileId) {
        const res = await imagekit.deleteFile(doc.mediaFileId);
        console.log('Image deleted from ImageKit',res);
      }
    }
    next();
  } catch (error) {
    console.error('Error during pre-delete middleware:', error);
    next(error as CallbackError); // Proceed with error handling
  }
});

export default mongoose.models.Tutorial || mongoose.model<ITutorial>('Tutorial', TutorialSchema);


