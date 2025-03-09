import mongoose, { Schema, model, models } from "mongoose";

export interface ILike {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // User who liked
  post?: mongoose.Types.ObjectId;
  tutorial?: mongoose.Types.ObjectId;
  artwork?: mongoose.Types.ObjectId;
  createdAt?: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    tutorial: { type: Schema.Types.ObjectId, ref: "Tutorial", default: null },
    artwork: { type: Schema.Types.ObjectId, ref: "Artwork", default: null },
  },
  { timestamps: true }
);

const Like = models?.Like || model<ILike>("Like", likeSchema);
export default Like;
