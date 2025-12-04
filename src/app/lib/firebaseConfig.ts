// src/app/lib/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXjUC6Ofh9qkfwlRQFgABePwPmuA1QBwI",
  authDomain: "biyaya-865cc.firebaseapp.com",
  projectId: "biyaya-865cc",

  // ✅ THIS IS YOUR REAL BUCKET — DO NOT CHANGE AGAIN
  storageBucket: "biyaya-865cc.firebasestorage.app",

  messagingSenderId: "942383778719",
  appId: "1:942383778719:web:1c00402f96f673ab450baa",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
