"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

type Product = {
  id: string;
  productName: string;
  price: number;
  currency: string;
  moq: number;
  unit: string;
  shortDesc?: string;
  longDesc?: string;
  image?: string;
  status?: "approved" | "pending" | "rejected";
  supplierId?: string;
  createdAt?: { seconds: number };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list: Product[] = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Product[];
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "products", id), {
        status: newStatus,
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: newStatus as any } : p
        )
      );
    } catch (err) {
      console.error("Error updating product status:", err);
    }
  };

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
        <p>Loading products...</p>
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
        🛒 Product Management
      </h1>

      <section
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No products found yet.
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
                <th style={{ padding: "10px 6px" }}>Image</th>
                <th style={{ padding: "10px 6px" }}>Name</th>
                <th style={{ padding: "10px 6px" }}>Price</th>
                <th style={{ padding: "10px 6px" }}>Status</th>
                <th style={{ padding: "10px 6px" }}>Supplier</th>
                <th style={{ padding: "10px 6px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f0e0b0" }}>
                  <td style={{ padding: "8px 6px" }}>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.productName}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#bbb" }}>No Image</span>
                    )}
                  </td>
                  <td style={{ padding: "8px 6px", fontWeight: 600 }}>
                    {p.productName}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {p.currency} {Number(p.price || 0).toFixed(2)} / {p.unit || "unit"}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {p.status === "approved" ? (
                      <span style={{ color: "green", fontWeight: 600 }}>Approved</span>
                    ) : p.status === "rejected" ? (
                      <span style={{ color: "red", fontWeight: 600 }}>Rejected</span>
                    ) : (
                      <span style={{ color: "orange", fontWeight: 600 }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {p.supplierId ? (
                      <Link
                        href={`/admin/suppliers/${p.supplierId}`}
                        style={{
                          color: "#8B4513",
                          textDecoration: "underline",
                        }}
                      >
                        View Supplier
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ padding: "8px 6px", display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleStatusChange(p.id, "approved")}
                      style={{
                        background: "#2e7d32",
                        color: "white",
                        padding: "6px 10px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(p.id, "rejected")}
                      style={{
                        background: "#c62828",
                        color: "white",
                        padding: "6px 10px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Reject
                    </button>
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
    