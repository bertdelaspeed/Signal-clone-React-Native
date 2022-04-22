// import * as firebase from "firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCp_xr7te8BRF2fhzIWuOO8YYW62KSSenU",
  authDomain: "signal-clone-13bcf.firebaseapp.com",
  projectId: "signal-clone-13bcf",
  storageBucket: "signal-clone-13bcf.appspot.com",
  messagingSenderId: "485474110093",
  appId: "1:485474110093:web:8a9062a72bb60f8d8370c4",
};

// let app;
// app = initializeApp(firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const auth = getAuth(app);

export { db, auth };
