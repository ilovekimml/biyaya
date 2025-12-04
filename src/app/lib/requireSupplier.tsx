"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function requireSupplier(Component: any) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.replace("/login");
          return;
        }

        const data = snap.data();

        // CHECK ROLE
        if (data.role === "supplier" || data.roles?.includes("supplier")) {
          setAllowed(true);
        } else {
          router.replace("/products");
        }
      });

      return () => unsub();
    }, [router]);

    if (!allowed) return null; // Prevent flicker

    return <Component {...props} />;
  };
}
