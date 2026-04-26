import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfiVGvzTwa_K-3K665hRPsi7oiGQmkGzM",
  authDomain: "dsa-verse-67378.firebaseapp.com",
  projectId: "dsa-verse-67378",
  storageBucket: "dsa-verse-67378.firebasestorage.app",
  messagingSenderId: "855949809515",
  appId: "1:855949809515:web:29288022203591e4251e2e",
  measurementId: "G-L05X1FXWH1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
