/**
 * NexusMMS Dashboard Functional Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. INITIALIZE DATA (Mock Database) ---
  const dashboardData = {
    totalShops: 128,
    monthlyRevenue: 42500,
    dailyFootfall: 3420,
    rentCollectionRate: 88,
  };

  // --- 2. SIDEBAR INTERACTIVITY ---
  const sidebarItems = document.querySelectorAll(".menu-item");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  sidebarItems.forEach((item) => {
    item.addEventListener("click", function () {
      sidebarItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");

      if (window.innerWidth < 992 && sidebarToggle) {
        sidebarToggle.checked = false;
      }
    });
  });

  // --- 3. DYNAMIC COUNTER ANIMATION ---
  const animateValue = (element, start, end, duration, isCurrency = false) => {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      let value = Math.floor(progress * (end - start) + start);

      element.innerHTML = isCurrency
        ? `$${value.toLocaleString()}`
        : value.toLocaleString() + (element.innerHTML.includes("%") ? "%" : "");

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const stats = document.querySelectorAll(".stat-card h3");
  if (stats.length >= 3) {
    animateValue(stats[0], 0, dashboardData.totalShops, 1000);
    animateValue(stats[1], 0, dashboardData.monthlyRevenue, 1500, true);
    animateValue(stats[2], 0, dashboardData.dailyFootfall, 1200);
  }

  // --- 4. QUICK ALERTS SYSTEM ---
  const alertList = document.getElementById("alert-list");
  const clearBtn = document.getElementById("clear-alerts");

  const addLiveAlert = (title, message, type = "primary") => {
    if (!alertList) return;
    const iconMap = {
      danger: "bi-exclamation-circle",
      warning: "bi-exclamation-triangle",
      success: "bi-check2-circle",
      primary: "bi-info-circle",
    };

    const alertHtml = `
            <div class="alert-item d-flex gap-3 mb-3 pb-3 border-bottom animate-fade-in">
                <div class="bg-${type}-subtle text-${type} p-2 rounded-3 h-100">
                    <i class="bi ${iconMap[type] || "bi-info-circle"}"></i>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${title}</h6>
                    <p class="small text-muted mb-0">${message}</p>
                </div>
                <button class="btn-close small dismiss-alert" style="font-size: 0.7rem;" aria-label="Close"></button>
            </div>
        `;
    alertList.insertAdjacentHTML("afterbegin", alertHtml);
  };

  if (alertList) {
    alertList.addEventListener("click", (e) => {
      if (e.target.classList.contains("dismiss-alert")) {
        const item = e.target.closest(".alert-item");
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        setTimeout(() => {
          item.remove();
          if (alertList.children.length === 0) {
            alertList.innerHTML =
              '<p class="text-center text-muted small py-4">No new alerts</p>';
          }
        }, 300);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      alertList.innerHTML =
        '<p class="text-center text-muted small py-4">All caught up!</p>';
    });
  }

  // --- 5. MODAL LOGIC ---
  const openModalBtn = document.getElementById("openmodel");
  const modal = document.getElementById("model");

  if (openModalBtn && modal) {
    const closeModalBtn = modal.querySelector(".btn-close");
    openModalBtn.addEventListener("click", () => {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("open");
      document.body.style.overflow = "auto";
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        document.body.style.overflow = "auto";
      }
    });
  }

  // --- 6. LOGOUT LOGIC (Alert Removed) ---
  const logoutBtn = document.querySelector(".btn-outline-danger");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Redirects immediately without confirmation popup
      window.location.href = "mainlogin.html";
    });
  }

// --- 8. DARK MODE LOGIC ---
const themeBtn = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
updateIcon(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });
}

function updateIcon(theme) {
  if (!themeIcon) return;
  if (theme === "dark") {
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    themeIcon.style.color = "#ffcc00";
  } else {
    themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    themeIcon.style.color = "";
  }
}})
