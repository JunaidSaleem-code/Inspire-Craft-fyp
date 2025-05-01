import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(session.user.id);
  const transactions = await Transaction.find({ seller: user._id, paymentStatus: "completed" });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    artworksSold: transactions.length,
    balance: transactions.reduce((acc, t) => acc + t.amount, 0),
  });
}
