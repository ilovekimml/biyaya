"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutDetailsPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    paymentMethod: "",
    notes: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");

    if (saved.length === 0) {
      router.push("/cart");
      return;
    }

    setCart(saved);
    setLoading(false);
  }, []);

  const goToReview = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.address ||
      !form.city ||
      !form.paymentMethod
    ) {
      alert("Please complete all required fields.");
      return;
    }

    localStorage.setItem("checkoutDetails", JSON.stringify(form));
    router.push("/checkout/review");
  };

  if (loading) return <div className="p-10">Loading checkout...</div>;

  // COMPUTE ORDER SUMMARY
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#5A4634]">
        Checkout Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: CUSTOMER INFO */}
        <div className="lg:col-span-2 space-y-4">

          <div className="border rounded-xl p-5 shadow bg-white">
            <h2 className="text-xl font-semibold mb-4 text-[#5A4634]">
              Customer Information
            </h2>

            <div className="space-y-3">
              <input
                className="border p-3 w-full rounded"
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />

              <input
                className="border p-3 w-full rounded"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />

              <input
                className="border p-3 w-full rounded"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <input
                className="border p-3 w-full rounded"
                placeholder="Delivery Address *"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />

              <input
                className="border p-3 w-full rounded"
                placeholder="City / Country *"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />

              {/* PAYMENT METHOD */}
              <div className="border p-5 rounded shadow bg-gray-50">
                <p className="font-bold mb-3 text-[#5A4634]">
                  Payment Method *
                </p>

                {["COD", "Bank Transfer", "GCash", "Card"].map((m) => (
                  <label key={m} className="flex items-center gap-3 mb-2">
                    <input
                      type="radio"
                      name="pm"
                      value={m}
                      onChange={(e) => updateField("paymentMethod", e.target.value)}
                    />
                    {m}
                  </label>
                ))}
              </div>

              <textarea
                className="border p-3 w-full rounded"
                rows={3}
                placeholder="Notes (Optional)"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="border rounded-xl p-6 shadow bg-white h-fit">
          <h2 className="text-xl font-semibold mb-4 text-[#5A4634]">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 border-b pb-4"
              >
                <div className="w-20 h-20 relative rounded overflow-hidden bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-[#5A4634]">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.qty} × {item.currency}
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-5 border-t pt-4">
            <p className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-[#5A4634]">
                {cart[0]?.currency}
                {subtotal.toLocaleString()}
              </span>
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push("/products")}
              className="w-full py-3 rounded-lg bg-gray-300"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="w-full py-3 rounded-lg bg-gray-200"
            >
              Back to Cart
            </button>

            <button
              onClick={goToReview}
              className="w-full py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#D4A373" }}
            >
              Review & Submit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
