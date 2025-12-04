"use client";

import Link from "next/link";

export default function SignupChoicePage() {
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
        Create Your BIYAYA Account
      </h2>

      <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
        Choose how you want to join
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link
          href="/signup/supplier"
          style={{
            backgroundColor: "#8B4513",
            color: "white",
            padding: "0.8rem",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sign Up as Supplier
        </Link>

        <Link
          href="/signup/buyer"
          style={{
            backgroundColor: "#555",
            color: "white",
            padding: "0.8rem",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sign Up as Buyer
        </Link>
      </div>
    </main>
  );
}
