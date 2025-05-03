import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest, { params }: { params: { artworkId: string } }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const artwork = await Artwork.findById(params.artworkId);
    if (!artwork) return NextResponse.json({ error: "Artwork not found" }, { status: 404 });

    // 1. Check for existing pending transaction
    let transaction = await Transaction.findOne({
      buyer: userId,
      artwork: artwork._id,
      paymentStatus: "pending",
    });

    if (!transaction) {
      // 2. Create new pending transaction
      transaction = await Transaction.create({
        buyer: userId,
        seller: artwork.artist,
        artwork: artwork._id,
        amount: artwork.price,
        currency: artwork.currency,
        paymentStatus: "pending",
        paymentMethod: "Stripe",
      });
    }

    // 3. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: artwork.currency.toLowerCase(), // e.g., pkr
            product_data: {
              name: artwork.title,
              images: [artwork.mediaUrl],
            },
            unit_amount: artwork.price * 100, // in paisa/cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        artworkId: artwork._id.toString(),
        transactionId: transaction._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?tx=${transaction._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/artwork/${artwork._id}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to initiate checkout" }, { status: 500 });
  }
}
