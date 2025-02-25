// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB9kcVbQDRQ71e34b4T-2e-LTslilcANhU",
  authDomain: "cresa-71811.firebaseapp.com",
  databaseURL: "https://cresa-71811-default-rtdb.firebaseio.com",
  projectId: "cresa-71811",
  storageBucket: "cresa-71811.firebasestorage.app",
  messagingSenderId: "565231222761",
  appId: "1:565231222761:web:3fd209375748cf2e485578",
  measurementId: "G-99HPG0Z6V7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()[0]
export const auth = getAuth(app)
export const database = getDatabase(app)
