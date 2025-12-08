"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        return;
      }

      setUser(currentUser);

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data: any = snap.data();
        if (data.roles?.includes("admin")) setRole("admin");
        else if (data.roles?.includes("supplier")) setRole("supplier");
        else if (data.role?.includes("buyer")) setRole("buyer");
        else setRole(null);
      }
    });

    return () => unsub();
  }, []);

  function handleLogout() {
    signOut(auth);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          BIYAYA
        </Link>

        <nav className="navbar-links">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About PH</Link>

          {role === "supplier" && (
            <Link href="/suppliers/dashboard" className="navbar-dashboard">
              Dashboard
            </Link>
          )}

          {role === "admin" && (
            <Link href="/admin/dashboard" className="navbar-dashboard">
              Admin
            </Link>
          )}

          {/* ✅ FIXED: ADD BUYER MY ORDERS */}
          {role === "buyer" && (
            <Link href="/orders" className="navbar-dashboard">
              My Orders
            </Link>
          )}
        </nav>

        {user ? (
          <button onClick={handleLogout} className="navbar-login">
            Logout
          </button>
        ) : (
          <Link href="/login" className="navbar-login">
            Login
          </Link>
        )}
      </div>

<style jsx>{`
        .navbar {
          width: 100%;
          background: #f5f5f5;
          padding: 0.6rem 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
        }

        .navbar-logo {
          font-weight: 700;
          font-size: 1.5rem;
          color: #8b4513;
          text-decoration: none;
        }

        .navbar-links {
          display: flex;
          gap: 1.8rem;
          align-items: center; /* FIX: vertical alignment */
        }

        .navbar-links a {
          text-decoration: none;
          color: #444;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .navbar-links a:hover {
          color: #8b4513;
        }

        .navbar-dashboard {
          background: #8b4513;
          color: white !important;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .navbar-login {
          background: #8b4513;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      `}</style>
    </header>
  );
}