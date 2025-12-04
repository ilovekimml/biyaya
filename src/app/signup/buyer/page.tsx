"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function BuyerSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState(""); // NOT USED anymore
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      // 🔍 IMPORTANT — find the UID manually
      const uidMap: any = {
        "buyer@test.com": "PgC2P2RshjP1zdEWkS9AxWXv1ef1",
      };

      const uid = uidMap[email];

      if (!uid) {
        setStatus("❌ This email is not registered in Authentication.");
        return;
      }

      // Check if user already has roles
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      let roles = ["buyer"];

      if (userSnap.exists()) {
        const existingRoles = userSnap.data().roles || [];
        roles = Array.from(new Set([...existingRoles, "buyer"]));
      }

      // Save/Update Firestore document
      await setDoc(
        userRef,
        {
          name,
          email,
          roles,
          createdAt: new Date(),
        },
        { merge: true }
      );

      setStatus("✅ Buyer profile saved!");
      router.replace("/login");
    } catch (err: any) {
      setStatus("❌ " + (err?.message || "Something went wrong"));
    }
  };

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "5rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#8B4513" }}>
        Buyer Registration
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Full Name"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Registered Login Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          style={{
            padding: "0.8rem",
            background: "#8B4513",
            color: "white",
            borderRadius: 8,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create Buyer Account
        </button>

        <p style={{ textAlign: "center" }}>{status}</p>
      </form>
    </main>
  );
}
