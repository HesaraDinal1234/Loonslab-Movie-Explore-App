// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyDG5gsMMuwpjw4557jMgbLJXA_qxupiiM8",
  authDomain: "movieverse-loonslab.firebaseapp.com",
  projectId: "movieverse-loonslab",
  storageBucket: "movieverse-loonslab.appspot.com",
  messagingSenderId: "766974208736",
  appId: "1:766974208736:web:ad24c9cf2b72962cb07e85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Export services
export { auth, db, signInWithEmailAndPassword }; // Add db to exports