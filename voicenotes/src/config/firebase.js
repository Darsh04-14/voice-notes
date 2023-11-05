import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmn40WSlV6tDXEEj2eHeR5ZZLPTcV5F3Y",
  authDomain: "voice-note-852c1.firebaseapp.com",
  projectId: "voice-note-852c1",
  storageBucket: "voice-note-852c1.appspot.com",
  messagingSenderId: "35034482729",
  appId: "1:35034482729:web:3109fc7ffe240408d43438",
  measurementId: "G-H2V6WNT0RM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();