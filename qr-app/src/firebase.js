// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABjhAupu_ChbvGwEs0V7HEFSPV0wh1zu4",
  authDomain: "control53.firebaseapp.com",
  projectId: "control53",
  storageBucket: "control53.firebasestorage.app",
  messagingSenderId: "810103553309",
  appId: "1:810103553309:web:e81395b7e651ee72a8b5f4",
  measurementId: "G-LXRXD3H3EJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
