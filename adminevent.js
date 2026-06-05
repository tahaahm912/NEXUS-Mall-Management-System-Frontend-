/**
 * NexusMMS - Unified Logic
 * Handles: Persistent Dark Mode, Sidebar, and Event Management
 */
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
}
// --- 2. INITIALIZATION ON DOM LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("dark-mode-toggle");

  // Theme Toggle Click Handler
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.hasAttribute("data-theme");
      const newTheme = isDark ? "light" : "dark";

      // Save to Local Storage so other pages can see it
      localStorage.setItem(THEME_KEY, newTheme);
      applyTheme();
    });
  }

  // Initialize Event Table specifically for the Events Page
  if (document.getElementById("eventTableBody")) {
    renderEvents();
  }
});

// --- 3. SIDEBAR NAVIGATION LOGIC ---
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarToggle = document.getElementById("sidebarToggle");
const closeSidebar = document.getElementById("closeSidebar");

if (sidebarToggle) {
  sidebarToggle.onclick = () => {
    sidebar.classList.add("show");
    overlay.classList.add("show");
  };
}

if (closeSidebar) {
  closeSidebar.onclick = () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  };
}

if (overlay) {
  overlay.onclick = () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  };
}

// --- 4. EVENT MANAGEMENT (STORAGE & CRUD) ---
const STORAGE_KEY = "nexus_events";

function getEvents() {
  const data = localStorage.getItem(STORAGE_KEY);
  // Returns default data if Local Storage is empty
  return data
    ? JSON.parse(data)
    : [
        {
          id: 1,
          name: "Summer Carnival 2024",
          location: "Outdoor Plaza",
          date: "2024-07-15",
          time: "10:00",
          status: "Upcoming",
        },
        {
          id: 2,
          name: "Tech Expo 2024",
          location: "Main Atrium",
          date: "2024-05-20",
          time: "09:00",
          status: "Ongoing",
        },
      ];
}

function renderEvents() {
  const events = getEvents();
  const filter = document.getElementById("filterLocation")?.value || "All";
  const body = document.getElementById("eventTableBody");
  const statUpcoming = document.getElementById("statUpcoming");

  if (!body) return;

  body.innerHTML = "";
  let upcomingCount = 0;

  events.forEach((ev) => {
    if (filter !== "All" && ev.location !== filter) return;
    if (ev.status === "Upcoming") upcomingCount++;

    body.innerHTML += `
            <tr>
                <td><span class="fw-bold">${ev.name}</span></td>
                <td>${ev.location}</td>
                <td>${ev.date}</td>
                <td>${ev.time}</td>
                <td><span class="badge-status badge-${ev.status.toLowerCase()}">${
      ev.status
    }</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border text-danger" onclick="deleteEvent(${
                      ev.id
                    })">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  if (statUpcoming) statUpcoming.innerText = upcomingCount;
}

// Event Creation
const addEventForm = document.getElementById("addEventForm");
if (addEventForm) {
  addEventForm.onsubmit = (e) => {
    e.preventDefault();
    const events = getEvents();

    const newEvent = {
      id: Date.now(),
      name: document.getElementById("titleInput").value,
      location: document.getElementById("locationInput").value,
      date: document.getElementById("dateInput").value,
      time: document.getElementById("timeInput").value,
      status: "Upcoming",
    };

    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    renderEvents();
    e.target.reset();

    // Switch back to "View All Events" tab
    const viewTabTrigger = document.querySelector("#view-events-tab");
    if (viewTabTrigger) {
      const tab = new bootstrap.Tab(viewTabTrigger);
      tab.show();
    }
  };
}

// Event Deletion
function deleteEvent(id) {
  if (confirm("Permanently delete this event?")) {
    const events = getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    renderEvents();
  }
}
