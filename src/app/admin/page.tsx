"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    pendingProducts: 0,
    pendingPayouts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        const suppliersSnap = await getDocs(collection(db, "suppliers"));
        const pendingProductsSnap = await getDocs(
          query(collection(db, "products"), where("status", "==", "pending"))
        );
        const pendingPayoutsSnap = await getDocs(
          query(collection(db, "payouts"), where("status", "==", "pending"))
        );

        setStats({
          totalProducts: productsSnap.size,
          totalSuppliers: suppliersSnap.size,
          pendingProducts: pendingProductsSnap.size,
          pendingPayouts: pendingPayoutsSnap.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, color, route }: any) => (
    <div
      onClick={() => route && router.push(route)}
      style={{
        flex: 1,
        background: "#fff",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        textAlign: "center",
        cursor: route ? "pointer" : "default",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <h3 style={{ color: "#8B4513", marginBottom: "0.5rem" }}>{title}</h3>
      <h1 style={{ color, fontSize: "2rem", margin: 0 }}>{value}</h1>
    </div>
  );

  return (
    <main
      style={{
        background: "#FFF9E6",
        minHeight: "100vh",
        padding: "3rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          color: "#8B4513",
          marginBottom: "2rem",
          fontWeight: "bold",
        }}
      >
        BIYAYA Admin Dashboard
      </h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          color="#4A9D7E"
          route="/admin/products"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingProducts}
          color="#F39C12"
          route="/admin/products"
        />
        <StatCard
          title="Suppliers"
          value={stats.totalSuppliers}
          color="#3498DB"
          route="/admin/suppliers"
        />
        <StatCard
          title="Pending Payouts"
          value={stats.pendingPayouts}
          color="#E74C3C"
          route="/admin/payouts"
        />
      </section>

      <p
        style={{
          textAlign: "center",
          marginTop: "3rem",
          color: "#8B4513",
          fontWeight: "500",
        }}
      >
        “From the Islands to the World” 🌏
      </p>
    </main>
  );
}
