/**
 * NexusMMS Professional Dashboard Controller
 * Full Functionality for Attendance, Storage, and UI States
 */

// --- 1. CONFIGURATION & STATE ---
const STORAGE_KEY = "nexus_employee_data";
const THEME_KEY = "nexus_theme";

// Default data if none exists in Local Storage
const defaultState = {
  name: "Alex",
  role: "Senior Associate",
  isClockedIn: false,
  stats: {
    hours: 38.5,
    tasks: 24,
    score: 4.9,
    service: 98,
  },
  activities: [
    {
      type: "New Sale",
      message: "Transaction #8842 - $1,240.00",
      time: "2 hours ago",
      icon: "bi-plus-circle-fill",
      color: "text-primary",
    },
    {
      type: "Ticket Updated",
      message: "Elevator maintenance report submitted.",
      time: "4 hours ago",
      icon: "bi-tools",
      color: "text-warning",
    },
  ],
};

// Load state from local storage
let employeeData =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState;

// --- 2. CORE UTILITIES ---

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employeeData));
  renderUI();
}

function renderUI() {
  // A. Update Quick Stats
  const statsValues = document.querySelectorAll(".stats-card h3");
  if (statsValues.length >= 4) {
    statsValues[0].textContent = `${employeeData.stats.hours}h`;
    statsValues[1].textContent = employeeData.stats.tasks;
    statsValues[2].textContent = `${employeeData.stats.score}/5.0`;
    statsValues[3].textContent = `${employeeData.stats.service}%`;
  }

  // B. Update Welcome Message & Clock Button
  const welcomeTitle = document.querySelector(".welcome-card h4");
  const clockBtn = document.querySelector(".welcome-card .btn:last-child");

  if (welcomeTitle)
    welcomeTitle.innerHTML = `Welcome back, ${employeeData.name}! 👋`;

  if (clockBtn) {
    if (employeeData.isClockedIn) {
      clockBtn.textContent = "Clock Out";
      clockBtn.className = "btn btn-danger rounded-pill px-4 fw-bold";
    } else {
      clockBtn.textContent = "Clock In";
      clockBtn.className = "btn btn-outline-light rounded-pill px-4 fw-bold";
    }
  }

  // C. Update Activity Feed
  const feed = document.querySelector(".activity-feed");
  if (feed) {
    const header = `<h5 class="fw-bold mb-4">Recent Activities</h5>`;
    const items = employeeData.activities
      .map(
        (act) => `
            <div class="activity-item">
                <div class="${act.color} fs-4"><i class="bi ${act.icon}"></i></div>
                <div>
                    <p class="mb-0 fw-bold">${act.type}</p>
                    <p class="text-muted small mb-0">${act.message}</p>
                    <small class="text-muted">${act.time}</small>
                </div>
            </div>
        `
      )
      .join("");
    feed.innerHTML = header + items;
  }
}

// --- 3. THEME ENGINE ---

function initTheme() {
  const themeBtn = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeIcon) {
      themeIcon.className =
        theme === "dark" ? "bi bi-sun-fill fs-5" : "bi bi-moon-stars-fill fs-5";
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "light" ? "dark" : "light");
    });
  }
}

// --- 4. EVENT LISTENERS ---

document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI and Theme
  renderUI();
  initTheme();

  // A. Schedule Modal Logic
  const scheduleModalElement = document.getElementById("scheduleModal");
  if (scheduleModalElement) {
    const scheduleModal = new bootstrap.Modal(scheduleModalElement);
    const viewScheduleBtn = document.querySelector(".welcome-card .btn-light");

    if (viewScheduleBtn) {
      viewScheduleBtn.addEventListener("click", () => scheduleModal.show());
    }
  }

  // B. Clock In/Out Action
  const clockBtn = document.querySelector(".welcome-card .btn:last-child");
  if (clockBtn) {
    clockBtn.addEventListener("click", () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      employeeData.isClockedIn = !employeeData.isClockedIn;

      // Create a real activity log
      const logEntry = {
        type: "Attendance",
        message: employeeData.isClockedIn
          ? "Clocked in for duty."
          : "Clocked out for the day.",
        time: timeString,
        icon: employeeData.isClockedIn
          ? "bi-person-check-fill"
          : "bi-person-dash-fill",
        color: employeeData.isClockedIn ? "text-success" : "text-danger",
      };

      employeeData.activities.unshift(logEntry);

      // Maintain list size
      if (employeeData.activities.length > 5) {
        employeeData.activities.pop();
      }

      saveState();
    });
  }

  // C. Logout Functionality
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      if (!confirmLogout) {
        e.preventDefault();
      } else {
        // Logic for actual logout redirection
        window.location.href = "mainlogin.html";
      }
    });
  }

  // D. Sidebar Item Interaction
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // E. Calendar Button Logic
  const calendarBtn = document.querySelector(".col-lg-4 .btn-primary");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      window.location.href = "calendar.html";
    });
  }
});
