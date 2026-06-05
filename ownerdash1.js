/**
 * NexusMMS - Owner Dashboard Logic
 * Handles: Theme toggling, Modals, and Dashboard state
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. THEME TOGGLE & PERSISTENCE ---
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeIcon.className = isDark
      ? "bi bi-sun-fill fs-5"
      : "bi bi-moon-stars-fill fs-5";
  };

  // Initialize Theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (themeIcon) themeIcon.className = "bi bi-sun-fill fs-5";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // --- 2. NOTIFICATION MODAL LOGIC ---
  const notificationBtn = document.querySelector(".btn-icon-circle");
  const notificationModalEl = document.getElementById("notificationModal");

  if (notificationBtn && notificationModalEl) {
    notificationBtn.addEventListener("click", () => {
      const modalInstance = new bootstrap.Modal(notificationModalEl);
      modalInstance.show();

      // Hide badge and save state
      const badge = notificationBtn.querySelector(".badge-notification");
      if (badge) {
        badge.style.display = "none";
        localStorage.setItem("notifications_read", "true");
      }
    });
  }

  // --- 3. DASHBOARD ACTIONS ---

  // Export functionality
  const exportBtn = document.querySelector(".btn-primary.rounded-pill");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Logout cleanup
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();
    });
  }

  // --- 4. DATA CLEANUP ---
  const cleanupData = () => {
    // Specifically removing the book data from LocalStorage
    localStorage.removeItem("featured_book");
    localStorage.removeItem("last_sale");

    // Restore notification badge state if not read
    if (localStorage.getItem("notifications_read") === "true") {
      const badge = document.querySelector(".badge-notification");
      if (badge) badge.style.display = "none";
    }
  };

  cleanupData();
});
