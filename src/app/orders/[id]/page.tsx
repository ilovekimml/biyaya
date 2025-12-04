"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // STATUS COLORS
  const STATUS_COLORS: any = {
    pending: "#E7B10A",
    approved: "#4CAF50",
    processing: "#1E88E5",
    shipped: "#7C3AED",
    delivered: "#FB8C00",
    completed: "#2E7D32",
    rejected: "#D32F2F",
  };

  // FORMAT ORDER NUMBER → BIYAYA-YYMM-10123
  function formatOrderNumber(id: string) {
    const now = new Date();
    const YY = now.getFullYear().toString().slice(-2);
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const last5 = id.slice(-5).toUpperCase();
    return `BIYAYA-${YY}${MM}-${last5}`;
  }

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;

      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        setOrder(null);
        setLoading(false);
        return;
      }

      const data = orderSnap.data();
      setOrder(data);

      // get supplier
      const firstItem = data.items?.[0];
      if (firstItem?.supplierId) {
        const supRef = doc(db, "suppliers", firstItem.supplierId);
        const supSnap = await getDoc(supRef);
        if (supSnap.exists()) setSupplier(supSnap.data());
      }

      setLoading(false);
    }

    loadOrder();
  }, [orderId]);

  if (loading) return <div className="p-10 text-center">Loading order...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#8B4513" }}>
        Track Your Order
      </h1>

      {/* ORDER SUMMARY BOX */}
      <div className="border rounded-xl p-6 bg-white shadow mb-8">
        <p className="font-bold text-xl mb-2">Order ID:</p>
        <p className="text-lg font-mono mb-4 text-brown-700">
          {formatOrderNumber(orderId)}
        </p>

        <p>
          <b>Total Amount:</b> ₱{order.totalAmount}
        </p>
        <p>
          <b>Payment Method:</b> {order.paymentMethod?.toUpperCase()}
        </p>

        <p className="mt-4">
          <b>Shipping To:</b> {order.shipName}
          <br />
          {order.shipAddress}
          <br />
          {order.shipPhone}
        </p>
      </div>

      {/* STATUS TRACKING */}
      <div className="border rounded-xl p-6 bg-white shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Order Status</h2>

        {[
          "pending",
          "approved",
          "processing",
          "shipped",
          "delivered",
          "completed",
          "rejected",
        ].map((status) => (
          <p key={status} className="flex items-center gap-3 mb-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor:
                  order.status === status
                    ? STATUS_COLORS[status]
                    : "#EFEFEF",
              }}
            ></span>
            <span
              style={{
                color:
                  order.status === status
                    ? STATUS_COLORS[status]
                    : "#666",
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </p>
        ))}
      </div>

      {/* ORDERED ITEMS */}
      <div className="border rounded-xl p-6 bg-white shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Ordered Items</h2>

        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between py-3 border-b">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-600">
                Qty: {item.qty} × ₱{item.price}
              </p>
            </div>

            <p className="font-bold">₱{item.subtotal}</p>
          </div>
        ))}
      </div>

      {/* SUPPLIER CONTACT */}
      <div className="border rounded-xl p-6 bg-white shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Supplier Contact</h2>

        <p className="text-gray-700 mb-4">
          The supplier will update the order status once they accept your order.
        </p>

        {supplier ? (
          <div className="mt-3">
            <p>
              <b>{supplier.storeName}</b>
            </p>
            <p>{supplier.ownerName}</p>
            <p>{supplier.phone}</p>
            <p>{supplier.email}</p>
          </div>
        ) : (
          <p className="text-gray-500">
            Supplier contact details will be added after we complete supplier
            profiles.
          </p>
        )}
      </div>

      <button
        onClick={() => (window.location.href = "/products")}
        className="px-6 py-3 rounded-lg text-white font-semibold"
        style={{ backgroundColor: "#D4A373" }}
      >
        Continue Shopping
      </button>
    </div>
  );
}
