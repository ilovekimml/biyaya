"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "@/app/lib/firebaseConfig";
import Link from "next/link";
import { formatOrderNumber } from "@/utils/formatOrderNumber";

;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // STATUS COLORS (same as Track Order page)
  const STATUS_COLORS: any = {
    pending: "#E7B10A",
    approved: "#4CAF50",
    processing: "#1E88E5",
    shipped: "#7C3AED",
    delivered: "#FB8C00",
    completed: "#2E7D32",
    rejected: "#D32F2F",
  };

  useEffect(() => {
    async function loadOrders() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, "orders");
      const q = query(ref, where("buyerId", "==", user.uid));
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt || null,
        };
      });

      // Sort newest to oldest
      list.sort((a, b) => {
        const aTime = a.createdAt?.seconds ?? 0;
        const bTime = b.createdAt?.seconds ?? 0;
        return bTime - aTime;
      });

      setOrders(list);
      setLoading(false);
    }

    loadOrders();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#8B4513" }}>
        My Orders
      </h1>

      {orders.length === 0 && (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      )}

      {orders.map((order) => {
        const firstItem = order.items?.[0];

        return (
          <div
            key={order.id}
            className="border rounded-xl p-6 bg-white shadow mb-8"
          >
            {/* Order ID */}
            <p className="text-lg font-bold mb-2">
              Order ID:{" "}
              <span className="font-extrabold">
                {formatOrderNumber(order.id)}
              </span>
            </p>

            {/* STATUS BADGE */}
            <span
              className="inline-block px-4 py-2 text-white rounded-full text-sm font-semibold mb-4"
              style={{
                backgroundColor:
                  STATUS_COLORS[order.status] || "#999",
              }}
            >
              {order.status.toUpperCase()}
            </span>

            {/* PRODUCT PREVIEW */}
            <div className="mt-2">
              <p className="font-bold">{firstItem?.name}</p>
              <p className="text-sm text-gray-600">
                Qty: {firstItem?.qty} × ₱{firstItem?.price}
              </p>
            </div>

            <div className="border-t my-4"></div>

            <p className="font-bold text-lg">
              Total: ₱{order.totalAmount.toLocaleString()}
            </p>

            <Link
              href={`/orders/${order.id}`}
              className="block text-center mt-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "#D4A373" }}
            >
              View Details
            </Link>
          </div>
        );
      })}
    </div>
  );
}
