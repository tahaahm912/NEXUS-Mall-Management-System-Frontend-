document.addEventListener("DOMContentLoaded", () => {
  // --- 1. THEME LOGIC ---
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      themeIcon.className = "bi bi-sun-fill fs-5";
    } else {
      document.body.classList.remove("dark-theme");
      themeIcon.className = "bi bi-moon-stars-fill fs-5";
    }
  };

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("nexus_theme", theme);
    applyTheme(theme);
  });

  // Init Theme from Storage
  applyTheme(localStorage.getItem("nexus_theme") || "light");

  // --- 2. PASSWORD LOGIC ---
  const passwordForm = document.querySelector("form");

  // Set a default password in storage if it doesn't exist
  if (!localStorage.getItem("owner_pass")) {
    localStorage.setItem("owner_pass", "admin123");
  }

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = passwordForm.querySelectorAll('input[type="password"]');
    const currentPassInput = inputs[0].value;
    const newPassInput = inputs[1].value;
    const confirmPassInput = inputs[2].value;

    const storedPass = localStorage.getItem("owner_pass");

    // Validation
    if (currentPassInput !== storedPass) {
      showAlert("Current password is incorrect!", "error");
      return;
    }

    if (newPassInput.length < 8) {
      showAlert("New password must be at least 8 characters.", "error");
      return;
    }

    if (newPassInput !== confirmPassInput) {
      showAlert("Passwords do not match!", "error");
      return;
    }

    // Success - Save to LocalStorage
    localStorage.setItem("owner_pass", newPassInput);
    showAlert("Password updated successfully!", "success");
    passwordForm.reset();
  });

  // --- 3. CUSTOM ALERT FUNCTION ---
  function showAlert(message, type) {
    // Remove existing alerts
    const existing = document.querySelector(".custom-alert");
    if (existing) existing.remove();

    const alertDiv = document.createElement("div");
    alertDiv.className = "custom-alert";
    alertDiv.style.backgroundColor = type === "error" ? "#ef4444" : "#0033FF";
    alertDiv.innerHTML = `<i class="bi ${
      type === "error" ? "bi-exclamation-circle" : "bi-check-circle"
    } me-2"></i> ${message}`;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.opacity = "0";
      alertDiv.style.transition = "0.5s";
      setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
  }
});
