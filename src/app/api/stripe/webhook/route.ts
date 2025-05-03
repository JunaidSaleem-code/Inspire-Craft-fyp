// src/app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

// Stripe secret key and webhook secret from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

// Configure Next.js to not parse the body so we can handle the raw data from Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

// Webhook endpoint to listen to Stripe events
export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Get Stripe's signature and the raw request body
    const sig = req.headers.get("stripe-signature")!;
    const buf = await req.arrayBuffer();
    const buffer = Buffer.from(buf);
    let event: Stripe.Event;

    try {
      // Verify the webhook signature and parse the event
      event = stripe.webhooks.constructEvent(buffer, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse("Webhook signature verification failed", { status: 400 });
    }

    // Handle the event for the checkout session completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const transactionId = session.metadata?.transactionId;

      if (transactionId) {
        // Update the transaction status to 'completed'
        await Transaction.findByIdAndUpdate(transactionId, {
          paymentStatus: "completed",
          transactionId: session.id,
        });
        console.log(`✅ Payment completed for transaction: ${transactionId}`);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse("Event received", { status: 200 });

  } catch (err) {
    console.error("Error processing webhook:", err);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
