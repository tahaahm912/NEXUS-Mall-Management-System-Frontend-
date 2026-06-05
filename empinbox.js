// --- THEME LOGIC (Preserving your existing setup) ---
const themeSwitcher = document.getElementById("theme-switcher");
const html = document.documentElement;

function initTheme() {
  const savedTheme = localStorage.getItem("nexus_theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);
}

function updateIcon(theme) {
  themeSwitcher.innerHTML =
    theme === "dark"
      ? '<i class="bi bi-sun-fill fs-5"></i>'
      : '<i class="bi bi-moon-stars-fill fs-5"></i>';
}

themeSwitcher.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("nexus_theme", newTheme);
  updateIcon(newTheme);
});

// --- INBOX FUNCTIONALITY ---

// 1. Data Structure for Messages
const messages = [
  {
    id: 1,
    sender: "HR Department",
    email: "hr@nexusmms.com",
    subject: "Performance Bonus Notification Q4",
    date: "Dec 21, 2025",
    time: "10:45 AM",
    category: "Primary",
    badge: "HR",
    badgeClass: "bg-primary",
    content:
      "<p>Dear Uzair,</p><p>We are pleased to inform you that based on your exceptional performance during the fourth quarter of 2024, you have been awarded a performance bonus.</p><p>The amount of <strong>$500.00</strong> will be included in your next paycheck.</p><p>Best Regards,</p><p class='fw-bold'>Nexus HR Team</p>",
  },
  {
    id: 2,
    sender: "Store Manager",
    email: "manager@nexusmms.com",
    subject: "Shift change approval for coming weekend",
    date: "Dec 21, 2025",
    time: "09:12 AM",
    category: "Primary",
    badge: "Shift",
    badgeClass: "bg-info",
    content:
      "<p>Hello Uzair,</p><p>Your request to swap shifts for this coming Saturday has been approved. Please coordinate with Sarah to ensure the floor is covered during the transition.</p><p>Regards,<br>Manager</p>",
  },
  {
    id: 3,
    sender: "System Security",
    email: "no-reply@nexusmms.com",
    subject: "Successful Password Change",
    date: "Dec 20, 2025",
    time: "11:00 PM",
    category: "System",
    badge: "Security",
    badgeClass: "bg-danger",
    content:
      "<p>Security Alert:</p><p>Your account password was successfully changed on Dec 20. If you did not perform this action, please contact IT support immediately.</p>",
  },
];

// 2. DOM Elements
const messageItemsContainer = document.querySelector(".message-items");
const viewBody = document.querySelector(".view-body");
const viewHeaderSender = document.querySelector(".view-header h6");
const viewHeaderEmail = document.querySelector(".view-header p");
const filterButtons = document.querySelectorAll(".btn-group .btn");
const searchInput = document.querySelector(".message-search input");

// 3. Function to Render Message List
function renderMessageList(filter = "Primary", searchKeyword = "") {
  messageItemsContainer.innerHTML = "";

  const filtered = messages.filter((msg) => {
    const matchesFilter = msg.category === filter;
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filtered.forEach((msg) => {
    const div = document.createElement("div");
    div.className = `message-item unread ${msg.id === 1 ? "active" : ""}`;
    div.innerHTML = `
            <div class="msg-title">${msg.sender}</div>
            <div class="msg-snippet">${msg.subject.substring(0, 40)}...</div>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <small class="text-muted">${msg.time}</small>
                <span class="badge rounded-pill ${
                  msg.badgeClass
                }" style="font-size: 0.6rem;">${msg.badge}</span>
            </div>
        `;

    div.onclick = () => selectMessage(msg, div);
    messageItemsContainer.appendChild(div);
  });
}

// 4. Function to Display Message in View Area
function selectMessage(msg, element) {
  // UI: Remove active classes
  document
    .querySelectorAll(".message-item")
    .forEach((i) => i.classList.remove("active"));
  element.classList.add("active");
  element.classList.remove("unread"); // Mark as read

  // UI: Update Content
  viewHeaderSender.innerText = msg.sender;
  viewHeaderEmail.innerText = `To: ${msg.email}`;
  viewBody.innerHTML = `
        <div class="d-flex justify-content-between mb-4">
            <h4 class="fw-bold">${msg.subject}</h4>
            <span class="text-muted small">${msg.date}</span>
        </div>
        ${msg.content}
    `;
}

// 5. Handle Filters (Primary vs System)
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderMessageList(btn.innerText);
  });
});

// 6. Handle Search
searchInput.addEventListener("input", (e) => {
  const activeFilter = document.querySelector(
    ".btn-group .btn.active"
  ).innerText;
  renderMessageList(activeFilter, e.target.value);
});

// 7. Synchronize Profile Name from LocalStorage (Personal Records logic)
function syncProfile() {
  const data = JSON.parse(localStorage.getItem("emp_personal_info"));
  if (data) {
    document.querySelector(".sidebar-user .fw-bold").innerText =
      data.fullName.split(" ")[0];
  }
}

// Run Initial Functions
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderMessageList("Primary");
  syncProfile();
});
