// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPW7ftL5ZHaGF9OR4ArqBcKdLplfGOess",
  authDomain: "nextjs-personal-blog.firebaseapp.com",
  projectId: "nextjs-personal-blog",
  storageBucket: "nextjs-personal-blog.appspot.com",
  messagingSenderId: "1013132756124",
  appId: "1:1013132756124:web:55c9876a681def99fe9959"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);