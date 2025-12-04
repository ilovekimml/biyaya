"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">

      {/* CHECK ICON */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(212,163,115,0.2)" }}
      >
        <svg width="70" height="70" viewBox="0 0 24 24" fill="#D4A373">
          <path d="M20.285 6.708l-11.31 11.31-5.657-5.657 1.414-1.414 4.243 4.243 9.897-9.897z" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>

      <p className="text-gray-700 mb-6 text-center">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      {orderId && (
        <p className="text-lg font-semibold mb-6">
          Order ID: <span className="font-bold">{orderId}</span>
        </p>
      )}

      <Link
        href="/orders"
        className="px-6 py-3 rounded-lg text-white font-semibold"
        style={{ backgroundColor: "#D4A373" }}
      >
        View My Orders
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
