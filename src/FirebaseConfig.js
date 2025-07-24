import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsACjJB8onRCod4ymr_u9Y7F7JqJYLsLo",
  authDomain: "clinic-management-496ec.firebaseapp.com",
  projectId: "clinic-management-496ec",
  storageBucket: "clinic-management-496ec.firebasestorage.app",
  messagingSenderId: "38372344628",
  appId: "1:38372344628:web:1b747d7ca577ce6d811b61",
  measurementId: "G-TZJXZY69NN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Initialize Firestore
export const db = getFirestore(app);
