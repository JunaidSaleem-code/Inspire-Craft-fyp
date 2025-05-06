import { NextResponse } from "next/server";
import Stripe from "stripe";
import Transaction from "@/models/Transaction";
import Artwork from "@/models/Artwork";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { artworkId } = await req.json();

  const artwork = await Artwork.findById(artworkId).populate("artist");
  if (!artwork) return NextResponse.json({ error: "Artwork not found" }, { status: 404 });

  const price = artwork.price;

  // Create transaction in DB
  const transaction = await Transaction.create({
    buyer: session.user.id,
    seller: artwork.artist._id,
    artwork: artwork._id,
    amount: artwork.price,
    currency: artwork.currency,
    paymentStatus: "pending",
    paymentMethod: "Stripe",
  });

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: artwork.currency,
          product_data: {
            name: `Artwork: ${artwork.title}`,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?tx=${transaction._id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    metadata: {
      transactionId: transaction._id.toString(),
    },
  });

  // Save Stripe session ID
  transaction.transactionId = stripeSession.id;
  await transaction.save();

  return NextResponse.json({ url: stripeSession.url });
}
