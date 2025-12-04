"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
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
          <path d="M20.285 6.708l-11.31 11.31-5.657-5.657 1.414-1.414 4.243 4.243 9.897-9.897z"></path>
        </svg>
      </div>

      {/* TITLE */}
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "#8B4513" }}
      >
        Order Placed Successfully!
      </h1>

      <p className="text-gray-600 text-center max-w-lg mb-6">
        Thank you for your order! Your supplier will review and confirm your request soon.
      </p>

      {/* ORDER INFORMATION */}
      <div className="bg-white border shadow-md rounded-xl p-6 w-full max-w-md mb-8">
        <p className="font-semibold text-lg mb-1">Order ID:</p>
        <p className="text-brown-700 font-bold break-all mb-4">{orderId}</p>

        <p className="text-gray-700">
          You will receive notifications once the supplier updates your order.
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <Link
          href={`/orders/${orderId}`}
          className="px-6 py-3 rounded-lg text-white font-semibold"
          style={{ backgroundColor: "#D4A373" }}
        >
          Track Order
        </Link>

        <Link
          href="/products"
          className="px-6 py-3 rounded-lg font-semibold border"
          style={{ borderColor: "#D4A373", color: "#8B4513" }}
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
