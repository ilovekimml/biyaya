"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  // Redirect based on user roles (AFTER login only)
  async function redirectUser(uid: string) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      router.replace("/products");
      return;
    }

    const roles = snap.data().roles || [];

    if (roles.includes("admin")) {
      router.replace("/admin/dashboard");
      return;
    }

    if (roles.includes("supplier") && roles.includes("buyer")) {
      router.replace("/choose-mode");
      return;
    }

    if (roles.includes("supplier")) {
      router.replace("/suppliers/dashboard");
      return;
    }

    router.replace("/products"); // buyer default
  }

  // LOGIN BUTTON FUNCTION
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Signing in…");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await redirectUser(result.user.uid);
    } catch (err: any) {
      setStatus("❌ " + (err?.message || "Login failed"));
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
      <h2
        style={{
          textAlign: "center",
          color: "#8B4513",
          fontWeight: 700,
          marginBottom: "0.3rem",
        }}
      >
        Login to BIYAYA
      </h2>

      <p style={{ textAlign: "center", opacity: 0.7, fontSize: "0.9rem" }}>
        One login for Supplier & Buyer mode
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1.8rem",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "0.7rem",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.7rem",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
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
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{status}</p>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
        Don’t have an account?{" "}
        <a href="/signup" style={{ color: "#8B4513", fontWeight: 600 }}>
          Sign Up
        </a>
      </p>
    </main>
  );
}
