import imagekit from "@/lib/imagekit";
import mongoose, { Schema, model, models, 
  CallbackError
 } from "mongoose";

export const POST_DIMENSIONS = {
  square: { width: 1080, height: 1080 }, //post
  landscape: { width: 1080, height: 566 },  //Tutorial
} as const;
export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaFileId: string;
  mediaType: "image" | "video";
  comments: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[] | [];
  // thumbnailUrl?: string;
  controls?: boolean;
  transformation?:{
    height: number;
    width: number;
    quality?: number;
  }
}

const postSchema = new Schema<IPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String , required: true},
    description: { type: String },
    mediaUrl: { type: String, required: true },
    mediaFileId: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }],
    // thumbnailUrl: { type: String },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number ,default: function (){return this.mediaType === "video" ? POST_DIMENSIONS.landscape.height : POST_DIMENSIONS.square.height }},
      width: { type: Number, default: function (){return this.mediaType === "video" ? POST_DIMENSIONS.landscape.width : POST_DIMENSIONS.square.width }},
      quality: { type: Number,min: 1, max: 100  },
    }
  },
  { timestamps: true }
);

postSchema.index({ title: "text", description: "text" });

postSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Find the document to be deleted
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      // Clean up likes related to this post
      const res = await mongoose.model('Like').deleteMany({ post: doc._id });
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

const Post = models?.Post || model<IPost>("Post", postSchema);

export default Post;

//usage example
// Create a new post:
// const newPost = await Post.create({ user: userId, title: "Post Title", mediaUrl: "image-url.jpg", mediaType: "image", likes: [], comments: [] });
// Fetch all posts:
// const posts = await Post.find().populate("user", "username avatar").populate("comments", "text");
// Like a post:
// const post = await Post.findById(postId); post.likes.push(userId); await post.save();
// Add a comment to a post:
// const newComment = new Comment({ post: postId, user: userId, text: "Nice post!" }); await newComment.save();
// Update post transformation:
// const post = await Post.findById(postId); post.transformation = { height: 1200, width: 1200 }; await post.save();
// Delete a post:
// await Post.findByIdAndDelete(postId);

// Search Query Example:
// const posts = await Post.find({ $text: { $search: "React" } });
