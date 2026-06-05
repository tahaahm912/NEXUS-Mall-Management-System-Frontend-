// --- INITIAL DATA & LOCAL STORAGE ---
const defaultStats = {
  revenue: 42850.5,
  expenditure: 18200.0,
  profit: 24650.5,
};

// Load or Initialize
let analyticsData =
  JSON.parse(localStorage.getItem("nexus_analytics")) || defaultStats;

// Check for saved theme immediately to prevent white flash
(function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('dark-mode-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Initialize Icon based on current theme
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    }

    // Toggle Theme Click Event
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            htmlElement.removeAttribute('data-theme');
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
            localStorage.setItem('theme', 'dark');
        }
    });
});

// Modal Global Functions
function closeNexusModal() {
    document.getElementById('nexusModal').style.display = 'none';
}

// --- CUSTOM POPUP SYSTEM ---
const modal = document.getElementById("nexusModal");

function showNexusPopup(title, message, type = "info", onConfirm = null) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;
  const icon = document.getElementById("modalIcon");
  const footer = document.getElementById("modalFooter");

  modal.style.display = "flex";
  icon.className = `bi fs-1 ${
    type === "danger"
      ? "bi-exclamation-triangle text-danger"
      : "bi-check-circle-fill text-primary"
  }`;

  if (onConfirm) {
    footer.innerHTML = `
            <button class="btn btn-secondary" onclick="closeNexusModal()">Cancel</button>
            <button class="btn btn-primary" id="modalConfirmBtn">Confirm</button>
        `;
    document.getElementById("modalConfirmBtn").onclick = () => {
      onConfirm();
      closeNexusModal();
    };
  } else {
    footer.innerHTML = `<button class="btn btn-primary px-4" onclick="closeNexusModal()">Got it</button>`;
  }
}

function closeNexusModal() {
  modal.style.display = "none";
}

// --- BUTTON FUNCTIONALITIES ---

// 1. Export CSV (Alerts removed, logic kept for functionality)
document.querySelector(".btn-light.border").onclick = () => {
  // Logic for export goes here
};

// 2. Dropdown Filters (Alerts removed)
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.onclick = (e) => {
    e.preventDefault();
    const period = e.target.innerText;
    document.querySelector(
      ".dropdown-toggle"
    ).innerHTML = `<i class="bi bi-calendar-event me-2"></i> ${period}`;
  };
});

// 3. Detailed Ledger Button (Alerts removed)
document.querySelector(".btn-outline-dark.w-100").onclick = () => {
  // Logic for ledger goes here
};

// 4. Logout (Immediate Alert & Redirect)
document.getElementById("logoutBtn").onclick = (e) => {
  e.preventDefault();
  window.location.href = "mainlogin.html";
};

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("nexus_theme"));
});
