"use client";

import { useState } from "react";
import { db, storage, auth } from "@/app/lib/firebaseConfig";
import { requireSupplier } from "@/app/lib/requireSupplier";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function UploadProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [category, setCategory] = useState("");
  const [origin, setOrigin] = useState("");
  const [unit, setUnit] = useState("");
  const [weight, setWeight] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Food",
    "Apparel",
    "Accessories",
    "Furniture",
    "Home Decor",
    "Crafts",
    "Bags",
    "Beauty",
  ];

  const units = ["piece", "kg", "g", "box", "pack", "meter", "liter"];

  function generateSKU() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // ✅ FIXED UPLOAD FUNCTION (Direct Firebase SDK Upload — No CORS errors)
  async function uploadImages(uid: string) {
    if (!images || images.length === 0) return [];

    const urls: string[] = [];

    for (const file of Array.from(images)) {
      const fileRef = ref(
        storage,
        `products/${uid}/${Date.now()}-${file.name}`
      );

      // ⛔ No manual upload URLs — Firebase SDK handles correct bucket
      await uploadBytes(fileRef, file);

      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }

    return urls;
  }

  // ✅ FIX: Find supplier using email
  async function findSupplierProfile(email: string) {
    const q = query(collection(db, "suppliers"), where("email", "==", email));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0];
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("Uploading…");

    try {
      const user = auth.currentUser;
      if (!user) return setStatus("❌ User not logged in.");

      const supplierDoc = await findSupplierProfile(user.email || "");
      if (!supplierDoc) {
        setLoading(false);
        return setStatus("❌ Supplier profile not found.");
      }

      const supplierData = supplierDoc.data();
      const imageUrls = await uploadImages(user.uid);

      await addDoc(collection(db, "products"), {
        name,
        description,
        price: Number(price),
        moq: Number(moq),
        category,
        origin,
        unit,
        weight,
        stock: Number(stock),
        images: imageUrls,
        supplierId: user.uid,
        supplierName: supplierData.name || "",
        supplierBusinessName: supplierData.businessName || "",
        supplierEmail: supplierData.email || "",
        sku: generateSKU(),
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setStatus("✅ Product uploaded successfully!");
      setLoading(false);
    } catch (err: any) {
      setStatus("❌ " + err.message);
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "6rem 1rem", maxWidth: 650, margin: "0 auto" }}>
      <h1
        style={{
          color: "#8B4513",
          fontWeight: 700,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Upload New Product
      </h1>

      <form
        onSubmit={handleUpload}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#fff",
          padding: "2rem",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <input
          className="input"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />

        <input
          className="input"
          type="number"
          placeholder="Price (PHP ₱)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          className="input"
          type="number"
          placeholder="MOQ"
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
          required
        />

        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Origin (e.g. Bohol)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />

        <select
          className="input"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          className="input"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#8B4513",
            color: "white",
            padding: "1rem",
            borderRadius: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Uploading…" : "Upload Product"}
        </button>

        {/* FINAL FIX: only show this when NOT loading */}
        {!loading && (
          <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{status}</p>
        )}
      </form>

      <style>{`
        .input {
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: #8B4513;
          box-shadow: 0 0 5px #8B4513;
        }
      `}</style>
    </main>
  );
}

export default requireSupplier(UploadProductPage);
