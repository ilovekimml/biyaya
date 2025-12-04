"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [shipName, setShipName] = useState("");
  const [shipAddress, setShipAddress] = useState("");
  const [shipPhone, setShipPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // LOAD CART WITH SUPPLIER ID INCLUDED
  useEffect(() => {
    async function loadCart() {
      if (!user) return;

      const ref = collection(db, "users", user.uid, "cart");
      const snap = await getDocs(ref);

      const items: any[] = [];

      for (const docx of snap.docs) {
        const cartItem = docx.data();
        const productRef = doc(db, "products", cartItem.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();

          items.push({
            cartId: docx.id,
            productId: cartItem.productId,
            qty: cartItem.qty,
            moq: productData.moq || 1,
            name: productData.name,
            price: productData.price,
            image: productData.images?.[0] || productData.image,
            supplierId: productData.supplierId,   // ✅ FIXED: IMPORTANT
          });
        }
      }

      setCartItems(items);
      setLoading(false);
    }

    loadCart();
  }, [user]);

  if (loading) return <div className="p-10">Loading...</div>;

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
    0
  );

  const updateQty = async (cartId: string, newQty: number) => {
    const updated = cartItems.map((item) =>
      item.cartId === cartId ? { ...item, qty: newQty } : item
    );
    setCartItems(updated);

    await updateDoc(doc(db, "users", user!.uid, "cart", cartId), {
      qty: newQty,
    });
  };

  const deleteItem = async (cartId: string) => {
    await deleteDoc(doc(db, "users", user!.uid, "cart", cartId));
    setCartItems(cartItems.filter((item) => item.cartId !== cartId));
  };

  // PLACE ORDER WITH SUPPLIER ID CORRECT
  async function placeOrder() {
    if (!shipName || !shipAddress || !shipPhone) {
      alert("Please complete shipping information.");
      return;
    }

    if (!paymentMethod) {
      alert("Please choose your payment method.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      buyerId: user?.uid,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.qty * item.price,
        supplierId: item.supplierId,    // ✅ FIXED: NOW SAVED PROPERLY
      })),
      totalAmount,
      shipName,
      shipAddress,
      shipPhone,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
      createdAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "orders"), orderData);

    // CLEAR CART
    for (const item of cartItems) {
      await deleteDoc(doc(db, "users", user!.uid, "cart", item.cartId));
    }

    router.push(`/checkout/success?orderId=${ref.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4 mb-8">
        <input
          value={shipName}
          onChange={(e) => setShipName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
        />

        <input
          value={shipAddress}
          onChange={(e) => setShipAddress(e.target.value)}
          placeholder="Complete Address"
          className="w-full p-3 border rounded-lg"
        />

        <input
          value={shipPhone}
          onChange={(e) => setShipPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="border p-5 rounded-xl bg-white shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Payment Method</h2>

        <div className="space-y-3 text-lg">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="gcash"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            GCash / Bank Transfer
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="cod"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery (COD)
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="manual"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Pay Upon Supplier Confirmation
          </label>
        </div>
      </div>

      <div className="border p-5 rounded-xl bg-white shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        {cartItems.map((item) => (
          <div
            key={item.cartId}
            className="flex justify-between items-center border-b py-4"
          >
            <div>
              <p className="font-semibold text-lg">{item.name}</p>

              <div className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Qty:</span>{" "}
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() =>
                    updateQty(
                      item.cartId,
                      Math.max(item.moq, Number(item.qty) - 1)
                    )
                  }
                >
                  -
                </button>

                <span className="mx-3">{item.qty}</span>

                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateQty(item.cartId, Number(item.qty) + 1)}
                >
                  +
                </button>

                <p className="text-xs text-gray-500 mt-1">
                  Minimum Order Quantity (MOQ): {item.moq}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-lg">
                ₱{item.qty * item.price}
              </p>

              <button
                onClick={() => deleteItem(item.cartId)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <p className="text-xl font-bold mt-4">
          Total:{" "}
          <span className="text-green-700">
            ₱{totalAmount.toLocaleString()}
          </span>
        </p>
      </div>

      <button
        onClick={placeOrder}
        className="w-full py-4 rounded-xl text-white text-lg font-semibold"
        style={{ backgroundColor: "#D4A373" }}
      >
        Place Order
      </button>
    </div>
  );
}
