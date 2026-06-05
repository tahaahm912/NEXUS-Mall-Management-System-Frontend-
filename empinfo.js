// --- EXISTING THEME LOGIC ---
const themeBtn = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const savedTheme = localStorage.getItem("nexus_theme") || "light";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "dark") {
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
  } else {
    themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
  }
  localStorage.setItem("nexus_theme", theme);
}
applyTheme(savedTheme);
themeBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
});

// --- NEW FUNCTIONALITY: PROFILE & DATA MANAGEMENT ---

// 1. Initialize Default Data in LocalStorage if empty
const defaultInfo = {
  fullName: "Uzair Umer",
  email: "uzair.umer@nexusmms.com",
  phone: "+1 (555) 012-3456",
  dept: "Sales & Premium Services",
};

if (!localStorage.getItem("emp_personal_info")) {
  localStorage.setItem("emp_personal_info", JSON.stringify(defaultInfo));
}

// 2. Load Data onto Page
function loadProfileData() {
  const data = JSON.parse(localStorage.getItem("emp_personal_info"));
  // Select elements by finding the value divs after the labels
  const values = document.querySelectorAll(".info-value");
  values[0].innerText = data.fullName;
  values[1].innerText = data.email;
  values[2].innerText = data.phone;
  values[3].innerText = data.dept;

  // Update Sidebar/Top Bar Name
  document.querySelector(".sidebar-user .fw-bold").innerText =
    data.fullName.split(" ")[0];
  document.querySelector(".text-center h6").innerText =
    data.fullName.split(" ")[0];
}

// 3. Handle Edit Button
const editBtn = document.querySelector(".record-card .btn-light");
editBtn.addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("emp_personal_info"));

  // Simple prompt-based edit for now (can be replaced with a Modal)
  const newName = prompt("Enter Full Name:", data.fullName);
  const newEmail = prompt("Enter Email:", data.email);
  const newPhone = prompt("Enter Phone:", data.phone);

  if (newName && newEmail && newPhone) {
    const updatedData = {
      ...data,
      fullName: newName,
      email: newEmail,
      phone: newPhone,
    };
    localStorage.setItem("emp_personal_info", JSON.stringify(updatedData));
    loadProfileData();
    alert("Profile Updated Locally!");
  }
});

// 4. Attendance "Month" Filter Simulation
const monthFilter = document.querySelector(".form-select");
monthFilter.addEventListener("change", (e) => {
  const tbody = document.querySelector("tbody");
  if (e.target.value === "Last Month") {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No records found for November</td></tr>`;
  } else {
    // Restore original HTML or reload page
    location.reload();
  }
});

// Run on Load
document.addEventListener("DOMContentLoaded", loadProfileData);
