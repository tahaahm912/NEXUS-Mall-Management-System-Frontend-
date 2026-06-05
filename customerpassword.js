document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const passwordForm = document.getElementById("passwordForm");
  const newPasswordInput = document.getElementById("newPassword");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  // --- 1. THEME MANAGEMENT ---
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    } else {
      document.body.classList.remove("dark-theme");
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    }
    localStorage.setItem("nexus-theme", theme);
  };

  // Load saved theme
  const savedTheme = localStorage.getItem("nexus-theme") || "light";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    applyTheme(isDark ? "light" : "dark");
  });

  // --- 2. PASSWORD STRENGTH METER ---
  newPasswordInput.addEventListener("input", () => {
    const val = newPasswordInput.value;
    let strength = 0;
    if (val.length >= 8) strength += 25;
    if (val.match(/[A-Z]/)) strength += 25;
    if (val.match(/[0-9]/)) strength += 25;
    if (val.match(/[^A-Za-z0-9]/)) strength += 25;

    strengthBar.style.width = strength + "%";

    if (strength <= 25) {
      strengthBar.style.backgroundColor = "#ff4d4d";
      strengthText.innerText = "Strength: Weak";
    } else if (strength <= 75) {
      strengthBar.style.backgroundColor = "#ffd93d";
      strengthText.innerText = "Strength: Medium";
    } else {
      strengthBar.style.backgroundColor = "#6BCB77";
      strengthText.innerText = "Strength: Strong";
    }
  });

  // --- 3. FORM SUBMISSION & ALERTS ---
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = passwordForm.querySelectorAll("input");
    const current = inputs[0].value;
    const newPass = inputs[1].value;
    const confirmPass = inputs[2].value;

    if (newPass !== confirmPass) {
      showAlert("Passwords do not match!", "error");
      return;
    }

    // Simulate Save to LocalStorage
    localStorage.setItem("user_password", newPass);
    showAlert("Password updated successfully!", "success");
    passwordForm.reset();
    strengthBar.style.width = "0%";
  });

  // --- 4. STYLED CUSTOM ALERT ---
  function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.className = `custom-alert alert-${type}`;
    alertBox.innerHTML = `
            <i class="bi ${
              type === "success" ? "bi-check-circle" : "bi-exclamation-triangle"
            } me-2"></i>
            ${message}
        `;
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.style.opacity = "1";
      alertBox.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.transform = "translateY(-20px)";
      setTimeout(() => alertBox.remove(), 500);
    }, 3000);
  }
});
