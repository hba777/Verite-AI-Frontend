import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRGt6iZkG1_nhBHyIqMNB41onZO-AxFu0",
  authDomain: "verite-ai-96c72.firebaseapp.com",
  projectId: "verite-ai-96c72",
  storageBucket: "verite-ai-96c72.firebasestorage.app",
  messagingSenderId: "888290626598",
  appId: "1:888290626598:web:27e2785fbe55eef8a52ae7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();