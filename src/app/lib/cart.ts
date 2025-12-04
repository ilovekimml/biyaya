import { db, auth } from "@/app/lib/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function addToCart(product: any) {
  const user = auth.currentUser;
  if (!user) return null;

  return await addDoc(collection(db, "users", user.uid, "cart"), {
    ...product,
    qty: 1,
    addedAt: Date.now()
  });
}

export async function getCartItems() {
  const user = auth.currentUser;
  if (!user) return [];

  const snap = await getDocs(collection(db, "users", user.uid, "cart"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function clearCart() {
  const user = auth.currentUser;
  if (!user) return;

  const snap = await getDocs(collection(db, "users", user.uid, "cart"));
  snap.docs.forEach(async (item) => {
    await deleteDoc(doc(db, "users", user.uid, "cart", item.id));
  });
}
