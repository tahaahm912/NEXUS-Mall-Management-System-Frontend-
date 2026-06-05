// --- THEME LOGIC (Keeping your existing logic) ---
const themeSwitcher = document.getElementById("theme-switcher");
const html = document.documentElement;

function initTheme() {
  const savedTheme = localStorage.getItem("nexus_theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
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
  updateThemeIcon(newTheme);
});

// --- PASSWORD STRENGTH LOGIC (Keeping your existing logic) ---
const newPassInput = document.getElementById("newPassword");
const strengthBar = document.getElementById("strengthBar");
const reqLength = document.getElementById("req-length");
const reqUpper = document.getElementById("req-upper");
const reqNumber = document.getElementById("req-number");

newPassInput.addEventListener("input", () => {
  const val = newPassInput.value;
  let strength = 0;

  const hasLength = val.length >= 8;
  const hasUpper = /[A-Z]/.test(val);
  const hasNum = /[0-9!@#$%^&*]/.test(val);

  if (hasLength) {
    strength += 33;
    reqLength.classList.add("met");
  } else {
    reqLength.classList.remove("met");
  }
  if (hasUpper) {
    strength += 33;
    reqUpper.classList.add("met");
  } else {
    reqUpper.classList.remove("met");
  }
  if (hasNum) {
    strength += 34;
    reqNumber.classList.add("met");
  } else {
    reqNumber.classList.remove("met");
  }

  strengthBar.style.width = strength + "%";

  if (strength < 40) strengthBar.style.backgroundColor = "#ef4444";
  else if (strength < 80) strengthBar.style.backgroundColor = "#f59e0b";
  else strengthBar.style.backgroundColor = "#10b981";
});

// --- NEW FUNCTIONAL LOGIC ---

// 1. Sync Sidebar Profile Name
function syncProfile() {
  const data = JSON.parse(localStorage.getItem("emp_personal_info"));
  if (data && data.fullName) {
    // Extract first name for the sidebar
    const firstName = data.fullName.split(" ")[0];
    document.querySelector(".sidebar-user .fw-bold").innerText = firstName;
  }
}

// 2. Form Submission & Validation
document.getElementById("passwordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const alertBox = document.getElementById("alertBox");
  const currentPass = e.target.querySelector('input[type="password"]').value; // First password input
  const newPass = newPassInput.value;
  const confirmPass = document.getElementById("confirmPassword").value;

  // A. Check if passwords match
  if (newPass !== confirmPass) {
    showAlert("Passwords do not match!", "alert-danger");
    return;
  }

  // B. Check if it meets the strength requirements (Full strength = 100)
  const hasLength = newPass.length >= 8;
  const hasUpper = /[A-Z]/.test(newPass);
  const hasNum = /[0-9!@#$%^&*]/.test(newPass);

  if (!hasLength || !hasUpper || !hasNum) {
    showAlert("Please meet all password requirements.", "alert-warning");
    return;
  }

  // C. Logic: Simulate "Saving" to LocalStorage
  // In a real app, you'd send currentPass and newPass to a server here.
  const securityData = {
    lastChanged: new Date().toLocaleDateString(),
    // We never store raw passwords in production, but for this demo:
    status: "Updated",
  };

  localStorage.setItem("nexus_security_log", JSON.stringify(securityData));

  // D. Success UI
  showAlert("Password updated successfully!", "alert-success");
  e.target.reset(); // Clear form
  strengthBar.style.width = "0%"; // Reset strength bar
  [reqLength, reqUpper, reqNumber].forEach((el) => el.classList.remove("met"));
});

// Helper function to show alerts
function showAlert(message, type) {
  const alertBox = document.getElementById("alertBox");
  alertBox.className = `alert ${type}`;
  alertBox.innerText = message;
  alertBox.classList.remove("d-none");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  syncProfile();
});
