"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const ref = collection(db, "products");
        const snap = await getDocs(ref);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(list);
      } catch (error) {
        console.error("Error loading products:", error);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-lg font-semibold">
        Loading products...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#8B4513" }}>
        Products
      </h1>

      {products.length === 0 && (
        <p className="text-center text-gray-600">No products available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl bg-white shadow-md overflow-hidden"
          >
            {/* PRODUCT IMAGE */}
            <div className="w-full h-60 relative">
              <Image
                src={product.images?.[0] || "/no-image.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              {/* PRODUCT NAME */}
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>

              {/* CATEGORY */}
              <p className="text-gray-500 text-sm mb-1">
                {product.category || "No category"}
              </p>

              {/* PRICE */}
              <p className="text-lg font-bold" style={{ color: "#8B4513" }}>
                ₱{product.price?.toLocaleString()} / {product.unit}
              </p>

              {/* MOQ */}
              <p className="text-sm text-gray-600">
                MOQ: {product.moq} {product.unit}
              </p>

              {/* SUPPLIER */}
              <p className="text-sm text-gray-600 mb-4">
                Supplier:{" "}
                {product.supplierName
                  ? product.supplierName
                  : "Unnamed Supplier"}
              </p>

              {/* BUTTON */}
              <Link
                href={`/products/${product.id}`}
                className="block w-full text-center py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: "#D4A373" }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
