// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKy5jCAzUWu7Dl8qs7m0vo6Hc7Wr_FeAk",
  authDomain: "timr-eee61.firebaseapp.com",
  databaseURL: "https://timr-eee61-default-rtdb.firebaseio.com",
  projectId: "timr-eee61",
  storageBucket: "timr-eee61.appspot.com",
  messagingSenderId: "838157516068",
  appId: "1:838157516068:web:98c6ee539dbbd3ad25c7b1",
  measurementId: "G-Q1BQLFKTD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db }
