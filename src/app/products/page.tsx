"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  moq: number;
  category?: string;
  origin?: string;

  image?: string;       // old field
  images?: string[];    // new field

  supplierId?: string;
}

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadProducts() {
      try {
        const snap = await getDocs(collection(db, "products"));

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Product[];

        setProducts(list);

        // Load suppliers
        const map: Record<string, string> = {};

        for (const item of list) {
          if (item.supplierId && !map[item.supplierId]) {
            const ref = doc(db, "users", item.supplierId);
            const supSnap = await getDoc(ref);

            if (supSnap.exists()) {
              const data = supSnap.data() as any;

              map[item.supplierId] =
                data.businessName ||
                data.name ||
                data.ownerName ||
                "Unnamed Supplier";
            } else {
              map[item.supplierId] = "Unnamed Supplier";
            }
          }
        }

        setSuppliers(map);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    }

    loadProducts();
  }, []);

  // Select main thumbnail
  const getThumbnail = (item: Product) => {
    if (item.images && item.images.length > 0) return item.images[0];
    if (item.image) return item.image;
    return null;
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="border shadow-md rounded-xl bg-white p-4 flex flex-col"
          >
            {/* IMAGE */}
            <div className="w-full h-56 relative mb-4 rounded-md overflow-hidden bg-gray-100">
              {getThumbnail(item) ? (
                <Image
                  src={getThumbnail(item)!}
                  alt={item.name || "Product Image"}
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* NAME */}
            <h2 className="font-bold text-lg leading-tight">{item.name}</h2>

            {/* CATEGORY */}
            <p className="text-sm text-gray-600">
              {item.category || "No category"}
            </p>

            {/* PRICE */}
            <p className="text-sm font-semibold mt-1 text-brown-700">
              ₱{item.price} / {item.unit}
            </p>

            {/* MOQ */}
            <p className="text-sm">
              MOQ: {item.moq} {item.unit}
            </p>

            {/* SUPPLIER */}
            <p className="text-sm mb-4">
              Supplier: {suppliers[item.supplierId ?? ""] || "Unnamed"}
            </p>

            {/* BUTTON */}
            <button
              onClick={() => router.push(`/products/${item.id}`)}
              className="w-full px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#D4A373" }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
