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
    <div className="products-container">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                className="product-image"
                alt={product.name}
              />
            ) : (
              <div className="product-image"></div>
            )}

            <div className="product-info">
              <div className="product-name">{product.name}</div>

              <div className="product-category">
                {product.category || "No category"}
              </div>

              <div className="product-price">
                ₱{product.price} / {product.unit}
              </div>

              <div>MOQ: {product.moq} {product.unit}</div>
              <div>Supplier: {product.supplier || "Unnamed Supplier"}</div>

              <a
                className="product-btn"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
