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
            <Link href="/suppliers/dashboard" className="nav-button">
              Dashboard
            </Link>
          )}

          {role === "admin" && (
            <Link href="/admin/dashboard" className="nav-button">
              Admin
            </Link>
          )}

          {role === "buyer" && (
            <Link href="/orders" className="nav-button">
              My Orders
            </Link>
          )}
        </nav>

        {user ? (
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        ) : (
          <Link href="/login" className="nav-button">
            Login
          </Link>
        )}
      </div>

      <style jsx>{`
        .navbar {
          width: 100%;
          background: #f5f5f5;
          padding: 10px 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          font-weight: 700;
          font-size: 1.6rem;
          color: #8b4513;
        }

        .navbar-links {
          display: flex;
          gap: 22px; /* original spacing */
          align-items: center;
        }

        .navbar-links a {
          font-size: 1rem;
          color: #444;
          text-decoration: none;
          font-weight: 500;
        }

        .nav-button {
          background: #8b4513;
          color: white !important;
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          height: 36px;
        }
      `}</style>
    </header>
  );
}
