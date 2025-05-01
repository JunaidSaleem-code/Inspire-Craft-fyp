import mongoose, { Schema, model, models } from "mongoose";

export interface ILike {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  tutorial?: mongoose.Types.ObjectId;
  artwork?: mongoose.Types.ObjectId;
  createdAt?: Date;
}

function validateSingleLike(this: mongoose.Document & ILike, next: (err?: mongoose.CallbackError) => void) {
  const likeCount = [this.post, this.tutorial, this.artwork].filter(Boolean).length;
  if (likeCount !== 1) {
    return next(new Error("A like must be associated with exactly one entity (Post, Tutorial, or Artwork)."));
  }
  next();
}

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    tutorial: { type: Schema.Types.ObjectId, ref: "Tutorial"},
    artwork: { type: Schema.Types.ObjectId, ref: "Artwork" },
  },
  { timestamps: true }
);

// Enforce one entity per like
likeSchema.pre("save", validateSingleLike);

// // Unique index for post likes
// likeSchema.index(
//   { user: 1, post: 1 },
//   { unique: true, partialFilterExpression: { post: { $exists: true } } }
// );

// // Unique index for tutorial likes
// likeSchema.index(
//   { user: 1, tutorial: 1 },
//   { unique: true, partialFilterExpression: { tutorial: { $exists: true } } }
// );

// // Unique index for artwork likes
// likeSchema.index(
//   { user: 1, artwork: 1 },
//   { unique: true, partialFilterExpression: { artwork: { $exists: true } } }
// );

likeSchema.index({ user: 1, post: 1 }, { unique: true, partialFilterExpression: { post: { $exists: true } } });
likeSchema.index({ user: 1, tutorial: 1 }, { unique: true, partialFilterExpression: { tutorial: { $exists: true } } });
likeSchema.index({ user: 1, artwork: 1 }, { unique: true, partialFilterExpression: { artwork: { $exists: true } } });

const Like = models?.Like || model<ILike>("Like", likeSchema);

export default Like;
