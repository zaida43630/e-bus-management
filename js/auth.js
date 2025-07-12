import { auth, db } from "./firebase-config.js"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { showToast } from "./utils.js"

class AuthManager {
  constructor() {
    this.currentUser = null
    this.userProfile = null
    this.initializeAuth()
    this.setupEventListeners()
  }

  initializeAuth() {
    onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out")
      this.currentUser = user

      if (user) {
        console.log("User UID:", user.uid)
        // User is signed in
        await this.loadUserProfile(user.uid)
        this.showDashboard()
      } else {
        // User is signed out
        this.userProfile = null
        this.showAuth()
      }

      this.hideLoading()
    })
  }

  async loadUserProfile(uid) {
    try {
      console.log("Loading user profile for UID:", uid)

      // Add retry logic for profile loading
      let retries = 3
      let userDoc = null

      while (retries > 0 && !userDoc?.exists()) {
        try {
          userDoc = await getDoc(doc(db, "users", uid))
          if (userDoc.exists()) {
            this.userProfile = userDoc.data()
            console.log("User profile loaded successfully:", this.userProfile)
            return
          } else {
            console.log(`User profile not found, retries left: ${retries - 1}`)
            retries--
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
            }
          }
        } catch (error) {
          console.error(`Error loading user profile (attempt ${4 - retries}):`, error)
          retries--
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
          } else {
            throw error
          }
        }
      }

      if (!userDoc?.exists()) {
        console.warn("User profile not found after retries. User may need to complete registration.")
        // Don't throw error, just show a warning
        showToast("Profile Incomplete", "Please complete your profile setup.", "error")
      }
    } catch (error) {
      console.error("Error loading user profile:", error)

      // Handle specific error cases
      if (error.code === "permission-denied") {
        showToast("Permission Error", "Please check Firestore security rules and try logging in again.", "error")
        // Force logout on permission error
        await this.handleLogout()
      } else if (error.code === "unavailable") {
        showToast("Connection Error", "Database unavailable. Please check your internet connection.", "error")
      } else {
        showToast("Profile Error", "Failed to load user profile. Please try again.", "error")
      }
    }
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.dataset.tab
        this.switchTab(tab)
      })
    })

    // Login form
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      this.handleLogin(e)
    })

    // Register form
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      this.handleRegister(e)
    })

    // Logout button
    document.getElementById("logout-btn").addEventListener("click", () => {
      this.handleLogout()
    })
  }

  switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-tab="${tab}"]`).classList.add("active")

    // Update forms
    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active")
    })
    document.getElementById(`${tab}-form`).classList.add("active")
  }

  async handleLogin(e) {
    e.preventDefault()

    const form = e.target
    const submitBtn = form.querySelector('button[type="submit"]')
    const email = form.email.value
    const password = form.password.value

    console.log("Login attempt for email:", email)
    this.setButtonLoading(submitBtn, true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login successful for user:", userCredential.user.uid)
      showToast("Login Successful", "Welcome back!", "success")
    } catch (error) {
      console.error("Login error:", error)

      let errorMessage = error.message
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later."
      }

      showToast("Login Failed", errorMessage, "error")
    } finally {
      this.setButtonLoading(submitBtn, false)
    }
  }

  async handleRegister(e) {
    e.preventDefault()

    const form = e.target
    const submitBtn = form.querySelector('button[type="submit"]')
    const formData = new FormData(form)

    console.log("Registration attempt for email:", formData.get("email"))
    this.setButtonLoading(submitBtn, true)

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.get("email"), formData.get("password"))

      console.log("User account created:", userCredential.user.uid)

      // Prepare user profile data
      const userProfileData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        role: formData.get("role"),
        phone: formData.get("phone"),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      console.log("Saving user profile:", userProfileData)

      // Save user profile to Firestore with retry logic
      let retries = 3
      let profileSaved = false

      while (retries > 0 && !profileSaved) {
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), userProfileData)
          profileSaved = true
          console.log("User profile saved successfully")
        } catch (profileError) {
          console.error(`Error saving profile (attempt ${4 - retries}):`, profileError)
          retries--
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
          } else {
            throw profileError
          }
        }
      }

      showToast("Registration Successful", "Your account has been created!", "success")

      // Clear form
      form.reset()
    } catch (error) {
      console.error("Registration error:", error)

      let errorMessage = error.message
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format."
      } else if (error.code === "permission-denied") {
        errorMessage = "Permission denied. Please check Firestore security rules."
      } else if (error.code === "unavailable") {
        errorMessage = "Database unavailable. Please check your internet connection."
      }

      showToast("Registration Failed", errorMessage, "error")
    } finally {
      this.setButtonLoading(submitBtn, false)
    }
  }

  async handleLogout() {
    try {
      await signOut(auth)
      console.log("User logged out successfully")
      showToast("Logged Out", "You have been logged out successfully.", "success")
    } catch (error) {
      console.error("Logout error:", error)
      showToast("Logout Failed", error.message, "error")
    }
  }

  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add("loading")
      button.disabled = true
    } else {
      button.classList.remove("loading")
      button.disabled = false
    }
  }

  showAuth() {
    document.getElementById("loading").classList.add("hidden")
    document.getElementById("auth-container").classList.remove("hidden")
    document.getElementById("dashboard-container").classList.add("hidden")
  }

  showDashboard() {
    document.getElementById("loading").classList.add("hidden")
    document.getElementById("auth-container").classList.add("hidden")
    document.getElementById("dashboard-container").classList.remove("hidden")

    // Update user info in header
    if (this.userProfile) {
      document.getElementById("user-info").textContent =
        `Welcome, ${this.userProfile.firstName} (${this.userProfile.role})`
    } else {
      document.getElementById("user-info").textContent = "Welcome, User"
    }
  }

  hideLoading() {
    document.getElementById("loading").classList.add("hidden")
  }

  getCurrentUser() {
    return this.currentUser
  }

  getUserProfile() {
    return this.userProfile
  }
}

// Create global auth manager instance
window.authManager = new AuthManager()

export default window.authManager
