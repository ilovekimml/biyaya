"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db, auth } from "@/app/lib/firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  moq: number;
  category?: string;
  origin?: string;
  description?: string;

  image?: string;
  images?: string[];

  supplierId?: string;
  supplierName?: string;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [added, setAdded] = useState(false);

  // LOAD PRODUCT
  useEffect(() => {
    async function load() {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Product;

        setProduct({ id, ...data });

        // Start quantity = MOQ
        setQty(data.moq || 1);

        setActiveImage(
          data.images?.[0] || data.image || null
        );
      }
    }

    if (id) load();
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  // --------------------------
  // ⭐ ADD TO CART
  // --------------------------
  async function handleAddToCart() {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    const userId = auth.currentUser.uid;

    await addDoc(collection(db, "users", userId, "cart"), {
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      qty: qty,                            // ⭐ Qty will never be undefined now
      image: product.images?.[0] || product.image || "",
      supplierId: product.supplierId || "",
      supplierName: product.supplierName || "",
      createdAt: Date.now(),
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT SECTION */}
      <div>
        <div className="w-full h-[450px] bg-gray-100 rounded-xl relative overflow-hidden">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              unoptimized
              className="object-cover object-center"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* THUMBNAILS */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-4 mt-4 overflow-x-auto">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`w-24 h-24 rounded-lg overflow-hidden border cursor-pointer ${
                  activeImage === img ? "border-4 border-brown-700" : "border-gray-300"
                }`}
                onClick={() => setActiveImage(img)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index}`}
                  width={100}
                  height={100}
                  unoptimized
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        <p className="text-lg mb-1">
          <b>Price:</b> ₱{product.price} / {product.unit}
        </p>

        <p className="text-lg mb-4">
          <b>MOQ:</b> {product.moq} {product.unit}
        </p>

        {/* DESCRIPTION */}
        {product.description && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Product Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}

        {/* SUPPLIER */}
        <div className="border p-4 rounded-xl mb-6">
          <h2 className="font-bold text-lg mb-2">Supplier Information</h2>
          <p>{product.supplierName || "Verified Supplier"}</p>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Quantity</h2>

          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg font-bold"
              onClick={() => qty > product.moq && setQty(qty - 1)}
            >
              −
            </button>

            <span className="text-xl font-semibold">{qty}</span>

            <button
              className="px-4 py-2 bg-gray-300 rounded-lg font-bold"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>

          {/* MOQ NOTE */}
          <p className="text-sm text-gray-600 mt-2">
            Minimum order starts at <b>{product.moq} {product.unit}</b> as required by the supplier.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-5">
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#D4A373" }}
          >
            Add to Cart
          </button>

          <button
            onClick={() => router.push("/checkout")}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#8B4513" }}
          >
            Checkout
          </button>
        </div>

        {added && (
          <p className="mt-4 text-green-600 font-medium">
            ✔ Added to cart!
          </p>
        )}
      </div>
    </div>
  );
}
