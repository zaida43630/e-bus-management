import { db } from "./firebase-config.js"
import { updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { showToast, getBadgeClass } from "./utils.js"

class UserManager {
  constructor() {
    this.users = []
  }

  async changeUserRole(userId, newRole) {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        lastUpdated: new Date().toISOString(),
      })
      showToast("Role Updated", `User role has been changed to ${newRole}.`, "success")
    } catch (error) {
      console.error("Error updating role:", error)
      showToast("Error", error.message, "error")
    }
  }

  async deleteUser(userId, userName) {
    if (confirm(`Are you sure you want to delete user ${userName}?`)) {
      try {
        await deleteDoc(doc(db, "users", userId))
        showToast("User Deleted", `User ${userName} has been removed from the system.`, "success")
      } catch (error) {
        console.error("Error deleting user:", error)
        showToast("Error", error.message, "error")
      }
    }
  }

  updateUsersGrid(users) {
    this.users = users
    const grid = document.getElementById("users-grid")

    if (!users.length) {
      grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 1rem;"></i>
                    <h3>No users found</h3>
                    <p>Users will appear here once they register for the system.</p>
                </div>
            `
      return
    }

    grid.innerHTML = users
      .map(
        (user) => `
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div class="card-title">${user.firstName} ${user.lastName}</div>
                            <div class="card-description" style="display: flex; align-items: center; margin-top: 0.25rem;">
                                <i class="fas fa-envelope" style="margin-right: 0.25rem; font-size: 0.75rem;"></i>
                                ${user.email}
                            </div>
                        </div>
                        <span class="badge ${getBadgeClass(user.role)}">${user.role}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div style="display: flex; align-items: center; margin-bottom: 0.75rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-phone" style="margin-right: 0.5rem;"></i>
                        ${user.phone}
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 1rem; font-size: 0.875rem; color: #64748b;">
                        <i class="fas fa-calendar" style="margin-right: 0.5rem;"></i>
                        Joined ${new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Change Role</label>
                        <select onchange="window.userManager.changeUserRole('${user.id}', this.value)" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
                            <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                            <option value="driver" ${user.role === "driver" ? "selected" : ""}>Driver</option>
                            <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-danger" style="width: 100%; font-size: 0.875rem;" onclick="window.userManager.deleteUser('${user.id}', '${user.firstName} ${user.lastName}')">
                        <i class="fas fa-trash" style="margin-right: 0.5rem;"></i>
                        Delete User
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

// Add CSS for users grid
const usersCSS = `
.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.user-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.user-stat {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.user-stat h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.25rem;
}

.user-stat p {
    font-size: 0.875rem;
    color: #64748b;
}

@media (max-width: 768px) {
    .users-grid {
        grid-template-columns: 1fr;
    }
    
    .user-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}
`

const style = document.createElement("style")
style.textContent = usersCSS
document.head.appendChild(style)

// Create global user manager instance
window.userManager = new UserManager()

export default window.userManager
