import mongoose, { Schema, model, models } from "mongoose";

export interface ITransaction {
  _id?: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  artwork: mongoose.Types.ObjectId;
  amount: number; // Amount of transaction
  currency: "PKR" | "USD" | "EUR"; // Default to PKR
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: "Stripe" | "PayPal" | "BankTransfer"; // Payment method
  transactionId?: string; // ID from payment provider (Stripe, PayPal, etc.)
  expiresAt?: Date; // Expiration date for pending transactions
  createdAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    artwork: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["PKR", "USD", "EUR"], default: "PKR" }, // Multi-currency support
    paymentStatus: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded"], 
      default: "pending" 
    },
    paymentMethod: { type: String, enum: ["Stripe", "PayPal", "BankTransfer"], default: "Stripe" },
    transactionId: { type: String, default: null }, // Payment gateway transaction ID
    expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) }, // Default 15 min expiry
  },
  { timestamps: true }
);

// 🔹 Unique index to prevent duplicate transactions
transactionSchema.index({ buyer: 1, artwork: 1, paymentStatus: 1 }, { unique: true });

const Transaction = models?.Transaction || model<ITransaction>("Transaction", transactionSchema);
export default Transaction;


// Usage Example:
// const transaction = await Transaction.create({
//   buyer: userId,
//   seller: sellerId,
//   artwork: artworkId,
//   amount: 100,
//   currency: "PKR",
//   paymentStatus: "pending",
//   paymentMethod: "Stripe",
//   transactionId: "txn_12345",
// });
// When Updating Payment Status (After Successful Payment)
// await Transaction.findByIdAndUpdate(transactionId, { paymentStatus: "completed" });
// When Fetching a User’s Transactions:
// const transactions = await Transaction.find({ buyer: userId }).sort({ createdAt: -1 });
