"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, storage, auth } from "@/app/lib/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { requireSupplier } from "@/app/lib/requireSupplier";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  moq: number;
  category?: string;
  origin?: string;
  images?: string[];
  supplierId?: string;
}

function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [moq, setMoq] = useState("");
  const [category, setCategory] = useState("");
  const [origin, setOrigin] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);

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

  // Load product
  useEffect(() => {
    async function load() {
      const refx = doc(db, "products", id);
      const snap = await getDoc(refx);
      if (snap.exists()) {
        const data = snap.data() as Product;
        setProduct({ id, ...data });

        setName(data.name);
        setPrice(String(data.price));
        setUnit(data.unit);
        setMoq(String(data.moq));
        setCategory(data.category || "");
        setOrigin(data.origin || "");
        setImages(data.images || []);
      }
    }

    if (id) load();
  }, [id]);

  // Delete existing image
  async function handleDeleteImage(url: string) {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);

      const updatedImages = images.filter((img) => img !== url);
      setImages(updatedImages);

      await updateDoc(doc(db, "products", id), {
        images: updatedImages,
        updatedAt: Timestamp.now(),
      });
    } catch (err: any) {
      alert("Error deleting image: " + err.message);
    }
  }

  // Upload new images
  async function uploadNewImages(): Promise<string[]> {
    if (!newImages) return [];

    const urls: string[] = [];

    for (const file of Array.from(newImages)) {
      const fileRef = ref(
        storage,
        `products/${auth.currentUser?.uid}/${Date.now()}-${file.name}`
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }

    return urls;
  }

  // Save updates
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedImages = [...images, ...(await uploadNewImages())];

      await updateDoc(doc(db, "products", id), {
        name,
        price: Number(price),
        unit,
        moq: Number(moq),
        category,
        origin,
        images: updatedImages,
        updatedAt: Timestamp.now(),
      });

      alert("Product updated successfully!");
      router.push("/suppliers/dashboard");
    } catch (err: any) {
      alert("Error updating product: " + err.message);
    }

    setLoading(false);
  }

  // Delete entire product
  async function handleDeleteProduct() {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));

      alert("Product deleted successfully!");
      router.push("/suppliers/dashboard");
    } catch (err: any) {
      alert("Error deleting product: " + err.message);
    }
  }

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#8B4513" }}>
        Edit Product
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white shadow-lg p-6 rounded-xl flex flex-col gap-4"
      >
        <input
          className="input"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="input"
          type="number"
          placeholder="Price (₱)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select
          className="input"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <input
          className="input"
          type="number"
          placeholder="MOQ"
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />

        {/* EXISTING IMAGES */}
        <div>
          <p className="font-semibold mb-2">Existing Images:</p>
          <div className="flex gap-4 overflow-x-auto">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt="product"
                  className="w-28 h-28 object-cover rounded-xl shadow"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ADD NEW IMAGES */}
        <div>
          <p className="font-semibold mb-2">Add More Images:</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages(e.target.files)}
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg text-white font-medium mt-4"
          style={{ backgroundColor: "#8B4513" }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* DELETE PRODUCT */}
        <button
          type="button"
          className="px-6 py-3 rounded-lg text-white font-medium mt-2 bg-red-600"
          onClick={handleDeleteProduct}
        >
          Delete Product
        </button>
      </form>

      {/* STYLE FOR INPUTS */}
      <style>{`
        .input {
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 10px;
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

export default requireSupplier(EditProductPage);
