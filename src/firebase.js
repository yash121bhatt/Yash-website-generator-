// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "yashai-84312.firebaseapp.com",
    projectId: "yashai-84312",
    storageBucket: "yashai-84312.firebasestorage.app",
    messagingSenderId: "101597078879",
    appId: "1:101597078879:web:7f6e06cb84b7a9c02b02ea"
};





// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };