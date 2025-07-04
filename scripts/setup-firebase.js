// Firebase Setup Instructions
console.log(`
🔥 Firebase Setup Instructions for Ebus Management System

1. Go to https://console.firebase.google.com/
2. Create a new project called "ebus-management"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on Web app icon
   - Copy the config object
6. Replace the config in lib/firebase.js with your actual config

Required Collections in Firestore:
- users: Store user profiles with roles (admin, driver, user)
- buses: Store bus information and real-time location data

Security Rules for Firestore:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow all authenticated users to read user profiles
    }
    
    // Buses collection
    match /buses/{busId} {
      allow read: if request.auth != null; // All authenticated users can read
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'driver']);
    }
  }
}

Environment Variables (if deploying):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
`)
