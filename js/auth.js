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
      this.currentUser = user

      if (user) {
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
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        this.userProfile = userDoc.data()
        console.log("User profile loaded:", this.userProfile)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
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

    this.setButtonLoading(submitBtn, true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      showToast("Login Successful", "Welcome back!", "success")
    } catch (error) {
      console.error("Login error:", error)
      showToast("Login Failed", error.message, "error")
    } finally {
      this.setButtonLoading(submitBtn, false)
    }
  }

  async handleRegister(e) {
    e.preventDefault()

    const form = e.target
    const submitBtn = form.querySelector('button[type="submit"]')
    const formData = new FormData(form)

    this.setButtonLoading(submitBtn, true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.get("email"), formData.get("password"))

      // Save user profile to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        role: formData.get("role"),
        phone: formData.get("phone"),
        createdAt: new Date().toISOString(),
      })

      showToast("Registration Successful", "Your account has been created!", "success")
    } catch (error) {
      console.error("Registration error:", error)
      showToast("Registration Failed", error.message, "error")
    } finally {
      this.setButtonLoading(submitBtn, false)
    }
  }

  async handleLogout() {
    try {
      await signOut(auth)
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
