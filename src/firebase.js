import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpNlL7odubWX5A1LWpzNZ3Um1qqpE0FpE",
  authDomain: "event-service-app.firebaseapp.com",
  projectId: "event-service-app",
  storageBucket: "event-service-app.firebasestorage.app",
  messagingSenderId: "844430415045",
  appId: "1:844430415045:web:e46f664a3acce0214e8cac",
  measurementId: "G-LGVT9TE9ZH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
