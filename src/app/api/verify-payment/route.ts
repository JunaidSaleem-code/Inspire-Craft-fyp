import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Transaction from "@/models/Transaction";
import Artwork from "@/models/Artwork";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // 1. Get the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, message: "Payment not completed" });
    }

    const transactionId = session.metadata?.transactionId;
    const artworkId = session.metadata?.artworkId;

    if (!transactionId || !artworkId) {
      return NextResponse.json({ error: "Metadata missing" }, { status: 400 });
    }

    // 2. Update the transaction and artwork
    await Transaction.findByIdAndUpdate(
      transactionId,
      { paymentStatus: "paid", stripeSessionId: sessionId },
      { new: true }
    );

    await Artwork.findByIdAndUpdate(artworkId, { isSold: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
