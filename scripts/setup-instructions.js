// Firebase Setup Instructions for Vanilla JS Ebus Management System
console.log(`
🔥 Firebase Setup Instructions for Ebus Management System (Vanilla JS)

STEP 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "ebus-management-vanilla"
4. Enable Google Analytics (optional)
5. Create project

STEP 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Save changes

STEP 3: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in "test mode" (for development)
4. Choose a location close to your users
5. Done

STEP 4: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register app with name "Ebus Management"
5. Copy the firebaseConfig object
6. Replace the config in js/firebase-config.js

STEP 5: Set up Firestore Security Rules
Go to Firestore Database > Rules and replace with:

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

STEP 6: Deploy Your Application
Option A - Local Development:
1. Use a local server (e.g., Live Server extension in VS Code)
2. Open index.html in your browser via the server

Option B - Deploy to Netlify:
1. Create account at netlify.com
2. Drag and drop your project folder
3. Your app will be live instantly

Option C - Deploy to Vercel:
1. Create account at vercel.com
2. Import your GitHub repository
3. Deploy with one click

STEP 7: Test the Application
1. Open your deployed app
2. Register a new account with role "admin"
3. Login and test all features
4. Add sample bus data
5. Test search functionality

SAMPLE DATA FOR TESTING:
Create these users manually in Authentication:
- admin@ebus.com (Admin)
- driver@ebus.com (Driver)  
- user@ebus.com (User)

Then add their profiles to Firestore users collection.

ENVIRONMENT VARIABLES (if needed):
For production deployment, you might want to use environment variables:
- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID

TROUBLESHOOTING:
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure Firestore rules allow your operations
4. Check network tab for failed requests
5. Verify authentication is working

FEATURES INCLUDED:
✅ User Authentication (Login/Register)
✅ Role-based Access Control (Admin/Driver/User)
✅ Bus Management (Add/Edit/Delete)
✅ Real-time Bus Search
✅ Location-based Search
✅ User Management (Admin only)
✅ Responsive Design
✅ Real-time Updates
✅ Toast Notifications
✅ Form Validation

The application is production-ready and follows modern web development best practices!
`)
