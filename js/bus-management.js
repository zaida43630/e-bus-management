import { db } from "./firebase-config.js"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { showToast, getBadgeClass, formatTime } from "./utils.js"

class BusManager {
  constructor() {
    this.buses = []
    this.editingBus = null
    this.setupEventListeners()

    // Debug: Check if db is properly initialized
    console.log("BusManager initialized, db instance:", db)
  }

  setupEventListeners() {
    // Add bus button
    document.getElementById("add-bus-btn").addEventListener("click", () => {
      this.openBusModal()
    })

    // Bus form submission
    document.getElementById("bus-form").addEventListener("submit", (e) => {
      this.handleBusForm(e)
    })

    // Modal close
    document.querySelector(".modal-close").addEventListener("click", () => {
      this.closeBusModal()
    })

    // Close modal on backdrop click
    document.getElementById("bus-modal").addEventListener("click", (e) => {
      if (e.target.id === "bus-modal") {
        this.closeBusModal()
      }
    })
  }

  openBusModal(bus = null) {
    const modal = document.getElementById("bus-modal")
    const form = document.getElementById("bus-form")
    const title = document.getElementById("modal-title")
    const editFields = document.getElementById("edit-fields")

    this.editingBus = bus

    if (bus) {
      // Edit mode
      title.textContent = "Edit Bus"
      editFields.classList.remove("hidden")
      this.populateForm(bus)
    } else {
      // Add mode
      title.textContent = "Add New Bus"
      editFields.classList.add("hidden")
      form.reset()
    }

    modal.classList.add("active")
  }

  closeBusModal() {
    const modal = document.getElementById("bus-modal")
    modal.classList.remove("active")
    this.editingBus = null
  }

  populateForm(bus) {
    const form = document.getElementById("bus-form")
    Object.keys(bus).forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`)
      if (input) {
        input.value = bus[key]
      }
    })
  }

  async handleBusForm(e) {
    e.preventDefault()

    const form = e.target
    const submitBtn = form.querySelector('button[type="submit"]')
    const formData = new FormData(form)

    // Debug logging
    console.log("Form submission started")
    console.log("Database instance:", db)
    console.log("Current user:", window.authManager?.getCurrentUser())

    this.setButtonLoading(submitBtn, true)

    const busData = {
      busNumber: formData.get("busNumber"),
      busType: formData.get("busType"),
      source: formData.get("source"),
      destination: formData.get("destination"),
      driverName: formData.get("driverName"),
      driverPhone: formData.get("driverPhone"),
      capacity: Number.parseInt(formData.get("capacity")),
      fare: Number.parseFloat(formData.get("fare")),
      departureTime: formData.get("departureTime"),
      arrivalTime: formData.get("arrivalTime"),
      lastUpdated: new Date().toISOString(),
    }

    console.log("Bus data prepared:", busData)

    try {
      // Check if user is authenticated
      const currentUser = window.authManager?.getCurrentUser()
      if (!currentUser) {
        throw new Error("User not authenticated. Please login again.")
      }

      // Check if db is initialized
      if (!db) {
        throw new Error("Database not initialized. Please refresh the page.")
      }

      if (this.editingBus) {
        // Update existing bus
        busData.status = formData.get("status")
        busData.currentLocation = formData.get("currentLocation")

        console.log("Updating bus:", this.editingBus.id)
        await updateDoc(doc(db, "buses", this.editingBus.id), busData)
        showToast("Bus Updated", `Bus ${busData.busNumber} has been updated.`, "success")
      } else {
        // Add new bus
        busData.status = "active"
        busData.currentLocation = busData.source
        busData.createdBy = currentUser.uid
        busData.createdAt = new Date().toISOString()

        console.log("Adding new bus to collection")
        const busesCollection = collection(db, "buses")
        console.log("Buses collection reference:", busesCollection)

        const docRef = await addDoc(busesCollection, busData)
        console.log("Bus added successfully with ID:", docRef.id)

        showToast("Bus Added", `Bus ${busData.busNumber} has been added to the system.`, "success")
      }

      this.closeBusModal()
    } catch (error) {
      console.error("Error saving bus:", error)
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      })

      let errorMessage = error.message
      if (error.code === "permission-denied") {
        errorMessage = "Permission denied. Please check your user role and try again."
      } else if (error.code === "unavailable") {
        errorMessage = "Database unavailable. Please check your internet connection."
      }

      showToast("Error", errorMessage, "error")
    } finally {
      this.setButtonLoading(submitBtn, false)
    }
  }

  async deleteBus(busId, busNumber) {
    if (confirm(`Are you sure you want to delete bus ${busNumber}?`)) {
      try {
        // Check if user is authenticated
        const currentUser = window.authManager?.getCurrentUser()
        if (!currentUser) {
          throw new Error("User not authenticated. Please login again.")
        }

        // Check if db is initialized
        if (!db) {
          throw new Error("Database not initialized. Please refresh the page.")
        }

        console.log("Deleting bus:", busId)
        await deleteDoc(doc(db, "buses", busId))
        showToast("Bus Deleted", `Bus ${busNumber} has been removed from the system.`, "success")
      } catch (error) {
        console.error("Error deleting bus:", error)
        showToast("Error", error.message, "error")
      }
    }
  }

  updateBusesGrid(buses) {
    this.buses = buses
    const grid = document.getElementById("buses-grid")
    const userProfile = window.authManager?.getUserProfile()

    if (!buses.length) {
      grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bus" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 1rem;"></i>
                    <h3>No buses found</h3>
                    <p>Start by adding your first bus to the system.</p>
                </div>
            `
      return
    }

    grid.innerHTML = buses
      .map(
        (bus) => `
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div class="card-title">${bus.busNumber}</div>
                            <div class="card-description" style="text-transform: capitalize;">${bus.busType}</div>
                        </div>
                        <span class="badge ${getBadgeClass(bus.status)}">${bus.status}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div style="display: flex; align-items: center; margin-bottom: 0.75rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem;"></i>
                        ${bus.source} → ${bus.destination}
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 0.75rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-clock" style="margin-right: 0.5rem;"></i>
                        ${formatTime(bus.departureTime)} - ${formatTime(bus.arrivalTime)}
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 0.75rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-phone" style="margin-right: 0.5rem;"></i>
                        ${bus.driverName} (${bus.driverPhone})
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.875rem;">
                        <span>Capacity: ${bus.capacity}</span>
                        <span style="font-weight: 600;">₹${bus.fare}</span>
                    </div>
                    
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 1rem;">
                        Current: ${bus.currentLocation}
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline" style="flex: 1; font-size: 0.75rem; padding: 0.5rem;" onclick="window.busManager.openBusModal(${JSON.stringify(bus).replace(/"/g, "&quot;")})">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        ${
                          userProfile?.role === "admin"
                            ? `
                            <button class="btn btn-danger" style="font-size: 0.75rem; padding: 0.5rem;" onclick="window.busManager.deleteBus('${bus.id}', '${bus.busNumber}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
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
}

// Add CSS for buses grid
const busesCSS = `
.buses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: #64748b;
}

.empty-state h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a202c;
}

@media (max-width: 768px) {
    .buses-grid {
        grid-template-columns: 1fr;
    }
}
`

const style = document.createElement("style")
style.textContent = busesCSS
document.head.appendChild(style)

// Create global bus manager instance
window.busManager = new BusManager()

export default window.busManager
