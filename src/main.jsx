import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8Zyft1zNMHr6sLEUiuRtuSWq28Q_9svM",
  authDomain: "test-fire-afc87.firebaseapp.com",
  projectId: "test-fire-afc87",
  storageBucket: "test-fire-afc87.appspot.com",
  messagingSenderId: "124987372280",
  appId: "1:124987372280:web:c66acd8e21a02d321dc10d",
  measurementId: "G-YEX9LMMG1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
