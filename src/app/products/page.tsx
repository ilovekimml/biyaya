"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const ref = collection(db, "products");
      const snap = await getDocs(ref);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(list);
      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {products.map((p) => (
        <div
          key={p.id}
          className="border rounded-xl mb-10 p-5 shadow-sm bg-white"
          style={{ borderColor: "#ddd" }}
        >
          {/* IMAGE */}
          <div className="w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={p.images?.[0] || "/no-image.png"}
              alt={p.name}
              width={800}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* CATEGORY */}
          <p className="text-gray-500 text-sm mb-1">
            {p.category || "No category"}
          </p>

          {/* PRICE */}
          <p className="text-lg font-bold">₱{p.price} / {p.unit}</p>

          {/* MOQ */}
          <p className="text-gray-700 text-sm mb-1">MOQ: {p.moq} {p.unit}</p>

          {/* SUPPLIER */}
          <p className="text-gray-700 text-sm mb-4">
            Supplier: {p.supplierName || "Unnamed Supplier"}
          </p>

          {/* BUTTON */}
          <Link
            className="block text-center py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "#D4A373" }}
            href={`/products/${p.id}`}
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
