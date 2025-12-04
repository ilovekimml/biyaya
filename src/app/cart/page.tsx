"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadCart() {
      const snap = await getDocs(collection(db, "carts", user.uid, "items"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
      setLoading(false);
    }

    loadCart();
  }, [user]);

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p>Please log in first.</p>
      </div>
    );
  }

  if (loading) return <div className="p-10">Loading cart...</div>;

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function removeItem(id: string) {
    await deleteDoc(doc(db, "carts", user.uid, "items", id));
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border p-4 rounded-xl"
              >
                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p>
                    ₱{item.price} / {item.unit}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border rounded-xl shadow-sm">
            <p className="text-xl font-bold">Total: ₱{total}</p>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-4 w-full bg-brown-600 text-white py-3 rounded-lg"
              style={{ backgroundColor: "#D4A373" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
