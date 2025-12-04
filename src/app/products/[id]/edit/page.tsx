"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db, auth } from "@/app/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  moq: number;
  category?: string;
  origin?: string;

  image?: string;
  images?: string[];

  supplierId?: string;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;

      // Load product
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data() as Product;
      const fullProduct = { id, ...data };
      setProduct(fullProduct);

      // Load default image
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0]);
      } else if (data.image) {
        setActiveImage(data.image);
      }

      // Check if logged in user is owner
      const user = auth.currentUser;
      if (user && data.supplierId === user.uid) {
        setIsOwner(true);
      }
    }

    load();
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT: MAIN IMAGE */}
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
            <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                  activeImage === img
                    ? "border-brown-600 border-4"
                    : "border-gray-300"
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

      {/* RIGHT: PRODUCT INFO */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <p className="text-lg">
          <b>Price:</b> ₱{product.price} / {product.unit}
        </p>

        <p className="text-lg mb-4">
          <b>MOQ:</b> {product.moq} {product.unit}
        </p>

        <p className="text-md mb-2">
          <b>Category:</b> {product.category || "No category"}
        </p>

        <p className="text-md mb-4">
          <b>Origin:</b> {product.origin || "Not specified"}
        </p>

        {/* Supplier Info */}
        <div className="border p-4 rounded-xl mb-4">
          <h2 className="font-bold text-lg mb-2">Supplier Information</h2>
          <p>{product.supplierId ? "Verified Supplier" : "No supplier info"}</p>
        </div>

        {/* IF SUPPLIER IS OWNER — SHOW EDIT BUTTON */}
        {isOwner ? (
          <button
            onClick={() => router.push(`/suppliers/edit/${product.id}`)}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#8B4513" }}
          >
            ✏ Edit This Product
          </button>
        ) : (
          /* IF NORMAL BUYER — SHOW INQUIRY + CART BUTTONS */
          <div className="flex gap-4 mt-4">
            <button
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#D4A373" }}
            >
              Send an Inquiry
            </button>

            <button
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#D4A373" }}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
