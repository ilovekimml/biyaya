"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FinalizeOrder() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Customer info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    if (saved.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(saved);
    setLoading(false);
  }, []);

  const submitOrder = async () => {
    if (!fullName || !phone || !address) {
      alert("Please complete all required fields.");
      return;
    }

    const orderId = "BYA-" + Math.floor(100000 + Math.random() * 900000);

    const order = {
      orderId,
      customer: {
        fullName,
        phone,
        email,
        address,
        notes,
        paymentMethod,
      },
      items: cart,
      status: "Awaiting Supplier Confirmation",
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const save = await fetch("/api/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (save.ok) {
      localStorage.removeItem("cart");
      router.push(`/order-success?orderId=${orderId}`);
    } else {
      alert("Error saving order.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Finalize Your Order
      </h1>

      {/* CUSTOMER FORM */}
      <div className="border p-6 rounded-lg shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Customer Information</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            className="border p-3 rounded"
            placeholder="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            className="border p-3 rounded"
            placeholder="Complete Address *"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <textarea
            className="border p-3 rounded"
            placeholder="Notes (optional)"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Debit/Credit Card</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={submitOrder}
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 shadow"
      >
        Submit Order
      </button>
    </div>
  );
}
