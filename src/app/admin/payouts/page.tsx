"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

type Payout = {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  status: "pending" | "paid";
  requestedAt?: { seconds: number };
  paidAt?: { seconds: number };
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const q = query(collection(db, "payouts"), orderBy("requestedAt", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Payout[];
        setPayouts(list);
      } catch (err) {
        console.error("Error fetching payouts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#fff9e6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#8B4513",
        }}
      >
        <p>Loading payout records...</p>
      </main>
    );
  }

  return (
    <main style={{ background: "#fff9e6", minHeight: "100vh", padding: "3rem" }}>
      <h1
        style={{
          color: "#8B4513",
          textAlign: "center",
          marginBottom: "2rem",
          fontWeight: "bold",
        }}
      >
        💰 Payout Tracking
      </h1>

      <section
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {payouts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No payout records found yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2c28e" }}>
                <th style={{ padding: "10px 6px" }}>Supplier</th>
                <th style={{ padding: "10px 6px" }}>Amount</th>
                <th style={{ padding: "10px 6px" }}>Status</th>
                <th style={{ padding: "10px 6px" }}>Requested</th>
                <th style={{ padding: "10px 6px" }}>Paid</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f0e0b0" }}>
                  <td style={{ padding: "8px 6px", fontWeight: 600 }}>
                    {p.supplierName || p.supplierId}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    ₱{p.amount?.toLocaleString() || "0.00"}
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      color: p.status === "paid" ? "green" : "#8B4513",
                      fontWeight: 600,
                    }}
                  >
                    {p.status.toUpperCase()}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {p.requestedAt
                      ? new Date(p.requestedAt.seconds * 1000).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {p.paidAt
                      ? new Date(p.paidAt.seconds * 1000).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
