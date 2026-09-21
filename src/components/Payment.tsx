"use client";
import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const hasFetched = useRef(false);

  useEffect(() => {
    const validatePayment = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const response = await fetch(`/api/services/payment-success?session_id=${sessionId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/confirmation?orderId=${data.orderId}`);
      } else {
        throw new Error("Failed to validate payment.");
      }
    };

    if (sessionId) {
      validatePayment().catch(error => {
        console.error("Payment validation error:", error);
        router.push("/");
      });
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Validation du paiement en cours...</p>
    </div>
  );
};

export default PaymentSuccess;
