"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SupplierSignup() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus("Creating account…");

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        businessName,
        contact,
        role: "supplier",
        createdAt: new Date(),
      });

      setStatus("Supplier account created!");
      router.replace("/suppliers/dashboard");
    } catch (err: any) {
      setStatus("❌ " + (err.message || "Signup failed"));
    }
  };

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "5.5rem auto 3rem",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#8B4513", fontWeight: 700 }}>
        Supplier Registration
      </h2>

      <form
        onSubmit={handleSignup}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1.8rem",
        }}
      >
        <input
          type="text"
          placeholder="Business / Store Name"
          required
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Contact Number"
          required
          onChange={(e) => setContact(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#8B4513",
            color: "white",
            padding: "0.75rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Create Supplier Account
        </button>

        <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{status}</p>
      </form>
    </main>
  );
}
