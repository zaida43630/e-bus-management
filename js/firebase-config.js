  

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQnkvsslfaJSIAU2u6aeDVOO6nlF1NWpk",
  authDomain: "e-bus-management-system-9bb3f.firebaseapp.com",
  projectId: "e-bus-management-system-9bb3f",
  storageBucket: "e-bus-management-system-9bb3f.firebasestorage.app",
  messagingSenderId: "37430841202",
  appId: "1:37430841202:web:fd54c60a9429a56ad617eb",
  measurementId: "G-L85FZSVW7Q"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Add connection state logging
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Firebase Auth: User signed in", user.uid)
  } else {
    console.log("Firebase Auth: User signed out")
  }
})

// Test Firestore connection
console.log("Firebase initialized successfully")
console.log("Firestore instance:", db)

export default app
