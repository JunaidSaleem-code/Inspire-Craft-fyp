// "use client";

// import { Button } from "@/components/ui/button";
// import { apiClient } from "@/lib/api-client";
// import { useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// export default function SuccessPage() {
//   const searchParams = useSearchParams();
//   const artworkId = searchParams.get("artworkId");

//   useEffect(() => {
//     const markAsSold = async () => {
//       if (!artworkId) return;

//       try {
//         await apiClient.markArtworkAsSold(artworkId);
//         console.log("Artwork marked as sold.");
//       } catch (err) {
//         console.error("Failed to mark artwork as sold:", err);
//       }
//     };

//     markAsSold();
//   }, [artworkId]);

//   return (
//     <div className="text-center py-10">
//       <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
//       <p className="mt-4">Thank you for purchasing the artwork.</p>
//       <Button onClick={() => window.location.href = "/" }  className="mt-4">Back to Home</Button>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

// Define a type for the transaction data
interface Transaction {
  _id: string;
  paymentStatus: string;
  amount: number;
  currency: string;
}

const SuccessPage = () => {
  const router = useRouter();
  const { tx } = router.query;  // Access transactionId from the URL
  const [transaction, setTransaction] = useState<Transaction | null>(null);  // Explicitly define the type

  useEffect(() => {
    if (!tx) return;  // Early return if there's no tx in query

    async function fetchTransaction() {
      const res = await fetch(`/api/transactions/${tx}`);
      const data = await res.json();
      setTransaction(data);
    }

    fetchTransaction();
  }, [tx]);  // Re-fetch if tx changes

  if (!transaction) return <div>Loading...</div>;

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Transaction ID: {transaction._id}</p>
      <p>Status: {transaction.paymentStatus}</p>
      <p>Amount: {transaction.amount}</p>
      <p>Currency: {transaction.currency}</p>
    </div>
  );
};

export default SuccessPage;
