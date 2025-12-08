"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const snap = await getDocs(collection(db, "products"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    }
    loadProducts();
  }, []);

  return (
    <div className="px-6 py-10 max-w-1200 mx-auto">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow-sm hover:shadow-md transition p-4 bg-white"
          >
            {/* Product Image */}
            {p.images?.length > 0 ? (
              <Image
                src={p.images[0]}
                alt={p.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                No Image
              </div>
            )}

            {/* Product Info */}
            <h2 className="text-lg font-semibold mt-3">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.category || "No category"}</p>

            <p className="mt-1 font-medium">
              ₱{p.price} / {p.unit || "piece"}
            </p>

            <p className="text-sm text-gray-500">MOQ: {p.moq} {p.unit}</p>

            <p className="text-sm mt-1">
              Supplier: <span className="font-medium">{p.supplierName || "Unnamed Supplier"}</span>
            </p>

            {/* View Button */}
            <button
              onClick={() => router.push(`/products/${p.id}`)}
              className="mt-3 w-full py-2 bg-[#b87333] text-white font-semibold rounded-md hover:bg-[#a1642b]"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
