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
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    }
    loadProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-600">No Image</span>
              </div>
            )}

            <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.category ?? "No category"}</p>
            <p className="text-sm font-medium">₱{product.price} / {product.unit}</p>
            <p className="text-sm text-gray-700">MOQ: {product.moq} {product.unit}</p>

            <button className="mt-3 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 w-full">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
