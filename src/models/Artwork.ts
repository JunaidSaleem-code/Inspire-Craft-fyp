import imagekit from "@/lib/imagekit";
import mongoose, { CallbackError, Schema, model, models } from "mongoose";
import slugify from 'slugify';

export const ARTWORK_DIMENSIONS = {
  square: { width: 1080, height: 1080 }, //post
  portrait: { width: 1080, height: 1350 },  //AI-Image,ArtWork
  landscape: { width: 1080, height: 566 },  //Tutorial
} as const;

export interface IArtwork extends Document {
  _id?: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaFileId: string;
  mediaType: "image" | "video";
  // thumbnailUrl?: string;
  price: number;
  currency: "PKR";
  isSold: boolean;
  buyer: mongoose.Types.ObjectId;
  soldAt?: Date;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  artType?: string;
  slug?: string;
}

const artworkSchema = new Schema<IArtwork>(
  {
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    mediaFileId: { type: String, required: true },
    // thumbnailUrl: { type: String },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["PKR"], default: "PKR" },
    isSold: { type: Boolean, default: false },
    soldAt: { type: Date, required: function (this: IArtwork) { return this.isSold; }, default: null },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    transformation: {
      height: { type: Number, default: ARTWORK_DIMENSIONS.portrait.height },
      width: { type: Number, default: ARTWORK_DIMENSIONS.portrait.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" ,default: []}],
    artType: { type: String, enum: ['drawing', 'painting', 'portrait', 'calligraphy', 'other'], default: 'other' },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

artworkSchema.index({ artist: 1 });
artworkSchema.index({ price: 1 });
artworkSchema.index({ isSold: 1 });
artworkSchema.index({ likes: 1 });
artworkSchema.index({ comments: 1 });
artworkSchema.index({ title: "text", tags: "text", category: "text" });


artworkSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

artworkSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Find the document to be deleted
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      // Clean up likes related to this post
      const res = await mongoose.model('Like').deleteMany({ artwork: doc._id });
      console.log('Associated likes deleted',res);
      
      // Clean up comments if needed (optional)
      // await mongoose.model("Comment").deleteMany({ post: doc._id });
      
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

const Artwork = models?.Artwork || model<IArtwork>("Artwork", artworkSchema);

export default Artwork;

//usage example
// const artwork = await Artwork.findOne({ slug: "sunset-over-the-mountains" });
// const digitalArtworks = await Artwork.find({ category: "drawing" });
// const trendingArtworks = await Artwork.find().sort({ likes: -1 }).limit(10);
// const mostDiscussedArtworks = await Artwork.find().sort({ comments: -1 }).limit(10);
// const availableArtworks = await Artwork.find({ isSold: false });
// const cheapArtworks = await Artwork.find({ price: { $lte: 5000 } }).sort({ price: 1 });
// const artworksByArtist = await Artwork.find({ artist: artistId });

// Search Query Example:
// const artworks = await Artwork.find({ $text: { $search: "sunset" } });
