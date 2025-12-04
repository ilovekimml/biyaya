"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebaseConfig"; // admin/suppliers/[id] -> lib
import { doc, getDoc } from "firebase/firestore";

type SupplierDoc = {
  displayName?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  about?: string;
  createdAt?: { seconds: number };
};

export default function AdminSupplierProfile() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<SupplierDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "suppliers", id));
        if (!alive) return;
        if (!snap.exists()) {
          setData(null);
        } else {
          setData(snap.data() as SupplierDoc);
        }
      } catch (e: any) {
        setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main style={{ background: "#fff9e6", minHeight: "100vh", padding: "28px" }}>
        <p>Loading supplier…</p>
      </main>
    );
  }

  if (err) {
    return (
      <main style={{ background: "#fff9e6", minHeight: "100vh", padding: "28px" }}>
        <p style={{ color: "#b00020" }}>Error loading supplier profile: {err}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ background: "#fff9e6", minHeight: "100vh", padding: "28px" }}>
        <p>Supplier not found.</p>
      </main>
    );
  }

  return (
    <main style={{ background: "#fff9e6", minHeight: "100vh", padding: "28px" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#7b4412", marginTop: 0 }}>Supplier Profile</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <strong>Name</strong>
            <div>{data.displayName || "—"}</div>
          </div>
          <div>
            <strong>Company</strong>
            <div>{data.company || "—"}</div>
          </div>
          <div>
            <strong>Email</strong>
            <div>{data.email || "—"}</div>
          </div>
          <div>
            <strong>Phone</strong>
            <div>{data.phone || "—"}</div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <strong>Address</strong>
            <div>{data.address || "—"}</div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <strong>About</strong>
            <div style={{ whiteSpace: "pre-wrap" }}>{data.about || "—"}</div>
          </div>
          {data.createdAt?.seconds ? (
            <div style={{ gridColumn: "1 / -1", color: "#7a6b54", fontSize: 13 }}>
              Joined: {new Date(data.createdAt.seconds * 1000).toLocaleString()}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
