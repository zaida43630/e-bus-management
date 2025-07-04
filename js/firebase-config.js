  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  // import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"
  
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDQnkvsslfaJSIAU2u6aeDVOO6nlF1NWpk",
    authDomain: "e-bus-management-system-9bb3f.firebaseapp.com",
    projectId: "e-bus-management-system-9bb3f",
    storageBucket: "e-bus-management-system-9bb3f.firebasestorage.app",
    messagingSenderId: "37430841202",
    appId: "1:37430841202:web:fd54c60a9429a56ad617eb",
    measurementId: "G-L85FZSVW7Q"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  // Initialize Firebase Authentication and get a reference to the service
  export const auth = getAuth(app)

  // Initialize Cloud Firestore and get a reference to the service
  export const db = getFirestore(app)

  export default app