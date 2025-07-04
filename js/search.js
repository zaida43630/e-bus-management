import { formatTime, getEstimatedArrival, getBadgeClass } from "./utils.js"

class SearchManager {
  constructor() {
    this.buses = []
    this.locations = []
    this.searchResults = []
    this.hasSearched = false
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Search button
    document.getElementById("search-btn").addEventListener("click", () => {
      this.performSearch()
    })

    // Clear search button
    document.getElementById("clear-search-btn").addEventListener("click", () => {
      this.clearSearch()
    })

    // Enter key on search inputs
    document.getElementById("search-source").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch()
    })

    document.getElementById("search-destination").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch()
    })
  }

  updateLocations(buses) {
    this.buses = buses

    // Extract unique locations
    const locationSet = new Set()
    buses.forEach((bus) => {
      locationSet.add(bus.source)
      locationSet.add(bus.destination)
    })

    this.locations = Array.from(locationSet).sort()
    this.updateLocationDataLists()
    this.displayAllBuses()
  }

  updateLocationDataLists() {
    const sourceDataList = document.getElementById("source-locations")
    const destinationDataList = document.getElementById("destination-locations")

    const optionsHTML = this.locations.map((location) => `<option value="${location}"></option>`).join("")

    sourceDataList.innerHTML = optionsHTML
    destinationDataList.innerHTML = optionsHTML
  }

  performSearch() {
    const source = document.getElementById("search-source").value.trim()
    const destination = document.getElementById("search-destination").value.trim()

    if (!source && !destination) {
      this.searchResults = this.buses
    } else {
      this.searchResults = this.buses.filter((bus) => {
        const sourceMatch = !source || bus.source.toLowerCase().includes(source.toLowerCase())
        const destinationMatch = !destination || bus.destination.toLowerCase().includes(destination.toLowerCase())
        return sourceMatch && destinationMatch
      })
    }

    this.hasSearched = true
    this.displaySearchResults()
  }

  clearSearch() {
    document.getElementById("search-source").value = ""
    document.getElementById("search-destination").value = ""
    this.searchResults = []
    this.hasSearched = false
    this.displayAllBuses()
  }

  displaySearchResults() {
    const resultsContainer = document.getElementById("search-results")
    const allBusesContainer = document.getElementById("all-buses")

    // Hide all buses container
    allBusesContainer.style.display = "none"

    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = `
                <div class="search-header">
                    <h3>Search Results (0 buses found)</h3>
                </div>
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 1rem;"></i>
                    <h3>No buses found</h3>
                    <p>Try adjusting your search criteria or check back later for new routes.</p>
                </div>
            `
    } else {
      resultsContainer.innerHTML = `
                <div class="search-header">
                    <h3>Search Results (${this.searchResults.length} buses found)</h3>
                </div>
                <div class="search-grid">
                    ${this.searchResults.map((bus) => this.createBusCard(bus)).join("")}
                </div>
            `
    }

    resultsContainer.style.display = "block"
  }

  displayAllBuses() {
    const resultsContainer = document.getElementById("search-results")
    const allBusesContainer = document.getElementById("all-buses")

    // Hide search results
    resultsContainer.style.display = "none"

    if (!this.hasSearched && this.buses.length > 0) {
      const displayBuses = this.buses.slice(0, 6)

      allBusesContainer.innerHTML = `
                <div class="section-header">
                    <h3>All Available Buses</h3>
                </div>
                <div class="buses-preview-grid">
                    ${displayBuses.map((bus) => this.createCompactBusCard(bus)).join("")}
                </div>
                ${
                  this.buses.length > 6
                    ? `
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="btn btn-outline" onclick="window.searchManager.showAllBuses()">
                            View All ${this.buses.length} Buses
                        </button>
                    </div>
                `
                    : ""
                }
            `

      allBusesContainer.style.display = "block"
    } else {
      allBusesContainer.style.display = "none"
    }
  }

  showAllBuses() {
    this.searchResults = this.buses
    this.hasSearched = true
    this.displaySearchResults()
  }

  createBusCard(bus) {
    return `
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div class="card-title">${bus.busNumber}</div>
                            <div class="card-description" style="text-transform: capitalize;">${bus.busType} • ${bus.capacity} seats</div>
                        </div>
                        <span class="badge ${getBadgeClass(bus.status)}">${bus.status}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div style="display: flex; align-items: center; margin-bottom: 0.75rem; font-size: 0.875rem;">
                        <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem; color: #10b981;"></i>
                        <span style="font-weight: 500;">${bus.source}</span>
                        <span style="margin: 0 0.5rem;">→</span>
                        <span style="font-weight: 500;">${bus.destination}</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.875rem;">
                        <div style="display: flex; align-items: center;">
                            <i class="fas fa-clock" style="margin-right: 0.5rem; color: #3b82f6;"></i>
                            <div>
                                <div style="font-weight: 500;">Departure</div>
                                <div>${formatTime(bus.departureTime)}</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <i class="fas fa-clock" style="margin-right: 0.5rem; color: #f59e0b;"></i>
                            <div>
                                <div style="font-weight: 500;">Est. Arrival</div>
                                <div>${getEstimatedArrival(bus.departureTime)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 0.75rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem;"></i>
                        <span>Current Location: </span>
                        <span style="font-weight: 500; margin-left: 0.25rem;">${bus.currentLocation}</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; font-size: 0.875rem;">
                            <i class="fas fa-phone" style="margin-right: 0.5rem;"></i>
                            <span>${bus.driverName}</span>
                        </div>
                        <div style="display: flex; align-items: center; font-size: 1.125rem; font-weight: 600;">
                            <i class="fas fa-rupee-sign" style="margin-right: 0.25rem;"></i>
                            ${bus.fare}
                        </div>
                    </div>
                    
                    <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem;">
                        Contact: ${bus.driverPhone}
                    </div>
                </div>
            </div>
        `
  }

  createCompactBusCard(bus) {
    return `
            <div class="card compact-card">
                <div class="card-header" style="padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="card-title" style="font-size: 1rem;">${bus.busNumber}</div>
                        <span class="badge ${getBadgeClass(bus.status)}" style="font-size: 0.75rem;">${bus.status}</span>
                    </div>
                </div>
                <div class="card-content" style="padding: 1rem; padding-top: 0;">
                    <div style="display: flex; align-items: center; margin-bottom: 0.5rem; font-size: 0.875rem;">
                        <i class="fas fa-map-marker-alt" style="margin-right: 0.25rem; font-size: 0.75rem;"></i>
                        ${bus.source} → ${bus.destination}
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 0.5rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-clock" style="margin-right: 0.25rem; font-size: 0.75rem;"></i>
                        ${formatTime(bus.departureTime)}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
                        <span>${bus.capacity} seats</span>
                        <span style="font-weight: 600;">₹${bus.fare}</span>
                    </div>
                </div>
            </div>
        `
  }
}

// Add CSS for search components
const searchCSS = `
.search-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.search-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-card p {
    color: #64748b;
    margin-bottom: 1.5rem;
}

.search-form {
    space-y: 1rem;
}

.search-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.search-buttons .btn {
    flex: 1;
}

.search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.search-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a202c;
}

.search-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
}

.buses-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.compact-card {
    transition: transform 0.2s;
}

.compact-card:hover {
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .search-grid {
        grid-template-columns: 1fr;
    }
    
    .buses-preview-grid {
        grid-template-columns: 1fr;
    }
    
    .search-buttons {
        flex-direction: column;
    }
}
`

const style = document.createElement("style")
style.textContent = searchCSS
document.head.appendChild(style)

// Create global search manager instance
window.searchManager = new SearchManager()

export default window.searchManager
