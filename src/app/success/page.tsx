"use client";

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
import LoadingSpinner from "@/components/LoadingSpinner";

const SuccessPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        setMessage("Session ID not found.");
        setLoading(false);
        return;
      }

      try {
        // Call your backend to verify the session and update the transaction
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({ sessionId }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (data.success) {
          setMessage("Payment Successful! Your transaction has been completed.");
        } else {
          setMessage("Payment verification failed.");
        }
      } catch {
        setMessage("An error occurred while verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStatus();
  }, []);

  if (loading) return <LoadingSpinner text="Verifying payment..." />;

  return (
    <div className="min-h-screen bg-black pt-24 pb-24 flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};

export default SuccessPage;
