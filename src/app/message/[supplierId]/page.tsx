"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/app/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function MessageSupplier({ params }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supplierId = params.supplierId;
  const productName = searchParams.get("product");

  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // CHECK USER LOGIN
  // ------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push(
          `/login?redirect=/message/${supplierId}?product=${productName}`
        );
        return;
      }
    });

    return () => unsub();
  }, []);

  // ------------------------------
  // GET SUPPLIER INFO
  // ------------------------------
  useEffect(() => {
    const getSupplier = async () => {
      const ref = doc(db, "suppliers", supplierId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSupplier(snap.data());
      } else {
        setSupplier(null);
      }

      setLoading(false);
    };

    getSupplier();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!supplier)
    return (
      <div className="p-10 text-center text-red-500">
        Supplier not found.
      </div>
    );

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Message Supplier</h1>

      <div className="border p-4 rounded-lg shadow">
        <p><b>Supplier Name:</b> {supplier.ownerName}</p>
        <p><b>Business:</b> {supplier.businessName}</p>
        <p><b>Email:</b> {supplier.email}</p>
        <p><b>Phone:</b> {supplier.phone}</p>
      </div>

      <div className="mt-6">
        <textarea
          className="w-full border p-3 rounded-lg"
          rows={5}
          defaultValue={`Hello, I am interested in your product: ${productName}`}
        ></textarea>
      </div>

      <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">
        Send Message
      </button>
    </div>
  );
}
