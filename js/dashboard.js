import { db } from "./firebase-config.js"
import { collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

class DashboardManager {
  constructor() {
    this.buses = []
    this.users = []
    this.setupEventListeners()
    this.initializeData()
  }

  setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const section = e.target.dataset.section
        this.switchSection(section)
      })
    })
  }

  switchSection(section) {
    // Update tab buttons
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.remove("active")
    })
    document.querySelector(`[data-section="${section}"]`).classList.add("active")

    // Update content sections
    document.querySelectorAll(".content-section").forEach((content) => {
      content.classList.remove("active")
    })
    document.getElementById(`${section}-section`).classList.add("active")

    // Hide tabs based on user role
    this.updateTabVisibility()
  }

  updateTabVisibility() {
    const userProfile = window.authManager.getUserProfile()
    if (!userProfile) return

    const busesTab = document.getElementById("buses-tab")
    const usersTab = document.getElementById("users-tab")

    // Show/hide buses tab for drivers and admins
    if (userProfile.role === "driver" || userProfile.role === "admin") {
      busesTab.style.display = "flex"
    } else {
      busesTab.style.display = "none"
    }

    // Show/hide users tab for admins only
    if (userProfile.role === "admin") {
      usersTab.style.display = "flex"
    } else {
      usersTab.style.display = "none"
    }
  }

  initializeData() {
    // Listen to buses collection
    const busesQuery = query(collection(db, "buses"))
    onSnapshot(busesQuery, (snapshot) => {
      this.buses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      this.updateStats()
      this.updateBusesDisplay()
      this.updateSearchLocations()
    })

    // Listen to users collection
    const usersQuery = query(collection(db, "users"))
    onSnapshot(usersQuery, (snapshot) => {
      this.users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      this.updateUserStats()
      this.updateUsersDisplay()
    })
  }

  updateStats() {
    // Total buses
    document.getElementById("total-buses").textContent = this.buses.length

    // Active routes (unique source-destination pairs)
    const routes = new Set(this.buses.map((bus) => `${bus.source}-${bus.destination}`))
    document.getElementById("active-routes").textContent = routes.size

    // Online buses
    const onlineBuses = this.buses.filter((bus) => bus.status === "active").length
    document.getElementById("online-buses").textContent = onlineBuses
  }

  updateUserStats() {
    document.getElementById("total-users").textContent = this.users.length
    document.getElementById("admin-count").textContent = this.users.filter((user) => user.role === "admin").length
    document.getElementById("driver-count").textContent = this.users.filter((user) => user.role === "driver").length
    document.getElementById("user-count").textContent = this.users.filter((user) => user.role === "user").length
  }

  updateBusesDisplay() {
    // This will be handled by bus-management.js
    if (window.busManager) {
      window.busManager.updateBusesGrid(this.buses)
    }
  }

  updateUsersDisplay() {
    // This will be handled by user-management.js
    if (window.userManager) {
      window.userManager.updateUsersGrid(this.users)
    }
  }

  updateSearchLocations() {
    // This will be handled by search.js
    if (window.searchManager) {
      window.searchManager.updateLocations(this.buses)
    }
  }

  updateProfile() {
    const userProfile = window.authManager.getUserProfile()
    if (!userProfile) return

    const profileInfo = document.getElementById("profile-info")
    profileInfo.innerHTML = `
            <div class="profile-grid">
                <div class="profile-item">
                    <label>First Name</label>
                    <p>${userProfile.firstName}</p>
                </div>
                <div class="profile-item">
                    <label>Last Name</label>
                    <p>${userProfile.lastName}</p>
                </div>
                <div class="profile-item">
                    <label>Email</label>
                    <p>${userProfile.email}</p>
                </div>
                <div class="profile-item">
                    <label>Role</label>
                    <p class="capitalize">${userProfile.role}</p>
                </div>
                <div class="profile-item">
                    <label>Phone</label>
                    <p>${userProfile.phone}</p>
                </div>
                <div class="profile-item">
                    <label>Member Since</label>
                    <p>${new Date(userProfile.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `
  }

  getBuses() {
    return this.buses
  }

  getUsers() {
    return this.users
  }
}

// Add CSS for profile grid
const profileCSS = `
.profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.profile-item label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 0.25rem;
}

.profile-item p {
    font-size: 0.875rem;
    color: #1a202c;
    font-weight: 500;
}

.capitalize {
    text-transform: capitalize;
}
`

const style = document.createElement("style")
style.textContent = profileCSS
document.head.appendChild(style)

// Create global dashboard manager instance
window.dashboardManager = new DashboardManager()

export default window.dashboardManager
