"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ReviewOrderPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const savedDetails = JSON.parse(localStorage.getItem("checkoutDetails") || "null");

    if (savedCart.length === 0) router.push("/cart");
    if (!savedDetails) router.push("/checkout/details");

    setCart(savedCart);
    setDetails(savedDetails);
  }, []);

  const submitOrder = async () => {
    setLoading(true);

    const orderId = "BYA-" + Date.now();
    const suppliersSet = new Set(cart.map((item: any) => item.supplierId));
const suppliers = Array.from(suppliersSet);

    await addDoc(collection(db, "orders"), {
      orderId,
      cart,
      customer: details,
      suppliers,
      total: cart.reduce((acc, i) => acc + i.qty * i.convertedPrice, 0),
      status: "Pending Supplier Confirmation",
      createdAt: serverTimestamp(),
    });

    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutDetails");

    router.push(`/checkout/success?orderId=${orderId}`);
  };

  if (!details) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Review Your Order</h1>

      <div className="border p-5 rounded shadow mb-6">
        <h2 className="font-bold text-xl mb-3">Customer Info</h2>
        <p><b>Name:</b> {details.name}</p>
        <p><b>Phone:</b> {details.phone}</p>
        <p><b>Email:</b> {details.email}</p>
        <p><b>Address:</b> {details.address}</p>
        <p><b>City:</b> {details.city}</p>
        <p><b>Payment Method:</b> {details.paymentMethod}</p>
      </div>

      <div className="border p-5 rounded shadow mb-6">
        <h2 className="font-bold text-xl mb-3">Order Items</h2>
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between mb-3">
            <p>{item.productName}</p>
            <p>
              {item.userCurrency}{" "}
              {(item.qty * item.convertedPrice).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={submitOrder}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg"
      >
        {loading ? "Submitting..." : "Submit Order"}
      </button>
    </div>
  );
}
