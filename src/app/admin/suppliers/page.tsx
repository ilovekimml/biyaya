"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

type Supplier = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  joinedAt?: { seconds: number };
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const q = query(collection(db, "suppliers"), orderBy("name"));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Supplier[];
        setSuppliers(list);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
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
        <p>Loading suppliers...</p>
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
        👩‍💼 Supplier Management
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
        {suppliers.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No suppliers found yet.
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
                <th style={{ padding: "10px 6px" }}>Name</th>
                <th style={{ padding: "10px 6px" }}>Company</th>
                <th style={{ padding: "10px 6px" }}>Email</th>
                <th style={{ padding: "10px 6px" }}>Phone</th>
                <th style={{ padding: "10px 6px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f0e0b0" }}>
                  <td style={{ padding: "8px 6px", fontWeight: 600 }}>
                    {s.name || "—"}
                  </td>
                  <td style={{ padding: "8px 6px" }}>{s.company || "—"}</td>
                  <td style={{ padding: "8px 6px" }}>{s.email || "—"}</td>
                  <td style={{ padding: "8px 6px" }}>{s.phone || "—"}</td>
                  <td style={{ padding: "8px 6px" }}>
                    <Link
                      href={`/admin/suppliers/${s.id}`}
                      style={{
                        background: "#8B4513",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        textDecoration: "none",
                      }}
                    >
                      View Profile
                    </Link>
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
