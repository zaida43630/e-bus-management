// Main application initialization
import authManager from "./auth.js"
import dashboardManager from "./dashboard.js"
import { showToast } from "./utils.js"

class App {
  constructor() {
    this.init()
  }

  init() {
    console.log("Ebus Management System initialized")

    // Wait for Firebase to initialize and auth state to be determined
    setTimeout(() => {
      this.setupGlobalEventListeners()
      this.updateUIBasedOnRole()
    }, 2000) // Increased timeout to ensure Firebase is fully loaded
  }

  setupGlobalEventListeners() {
    // Update profile when dashboard loads
    const profileObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.id === "dashboard-container" && !mutation.target.classList.contains("hidden")) {
          dashboardManager.updateProfile()
          dashboardManager.updateTabVisibility()
        }
      })
    })

    profileObserver.observe(document.getElementById("dashboard-container"), {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Handle window resize for responsive design
    window.addEventListener("resize", this.handleResize.bind(this))
  }

  updateUIBasedOnRole() {
    const userProfile = authManager.getUserProfile()
    if (!userProfile) return

    // Update navigation based on role
    dashboardManager.updateTabVisibility()

    // Set default active section based on role
    if (userProfile.role === "user") {
      dashboardManager.switchSection("search")
    } else {
      dashboardManager.switchSection("buses")
    }
  }

  handleResize() {
    // Handle responsive design adjustments
    const width = window.innerWidth

    if (width < 768) {
      // Mobile adjustments
      document.body.classList.add("mobile")
    } else {
      document.body.classList.remove("mobile")
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing app...")
  new App()
})

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error)
  if (window.showToast) {
    showToast("Error", "An unexpected error occurred. Please try again.", "error")
  }
})

// Global unhandled promise rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
  if (window.showToast) {
    showToast("Error", "An unexpected error occurred. Please try again.", "error")
  }
})
