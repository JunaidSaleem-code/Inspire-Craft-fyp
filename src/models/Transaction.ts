import mongoose, { Schema, model, models } from "mongoose";

export interface ITransaction {
  _id?: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  artwork: mongoose.Types.ObjectId;
  amount: number; // Amount in PKR
  paymentStatus: "pending" | "completed" | "failed";
  transactionId?: string; // From Stripe
  createdAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    artwork: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String, default: null }, // Stripe transaction ID
  },
  { timestamps: true }
);

const Transaction = models?.Transaction || model<ITransaction>("Transaction", transactionSchema);
export default Transaction;
