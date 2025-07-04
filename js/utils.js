// Utility functions

export function showToast(title, message, type = "success") {
  const toastContainer = document.getElementById("toast-container")

  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`

  const icon = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle"

  toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `

  toastContainer.appendChild(toast)

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.remove()
  }, 5000)
}

export function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function getEstimatedArrival(departureTime) {
  const [hours, minutes] = departureTime.split(":").map(Number)
  const estimatedMinutes = Math.floor(Math.random() * 30) + 15 // 15-45 minutes
  const arrivalTime = new Date()
  arrivalTime.setHours(hours, minutes + estimatedMinutes)
  return arrivalTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function getBadgeClass(status) {
  const badgeClasses = {
    active: "badge-active",
    inactive: "badge-inactive",
    maintenance: "badge-maintenance",
    admin: "badge-admin",
    driver: "badge-driver",
    user: "badge-user",
  }
  return badgeClasses[status] || "badge-inactive"
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
