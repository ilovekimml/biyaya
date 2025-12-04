"use client";

import Link from "next/link";

export default function ChooseModePage() {
  return (
    <main
      style={{
        maxWidth: 420,
        margin: "5.5rem auto 3rem",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#8B4513", fontWeight: 700, marginBottom: "1rem" }}>
        Choose Your Mode
      </h2>

      <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
        You have both Supplier and Buyer access.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link
          href="/suppliers/dashboard"
          style={{
            backgroundColor: "#8B4513",
            color: "white",
            padding: "0.9rem",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Continue as Supplier
        </Link>

        <Link
          href="/products"
          style={{
            backgroundColor: "#555",
            color: "white",
            padding: "0.9rem",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Continue as Buyer
        </Link>
      </div>
    </main>
  );
}
