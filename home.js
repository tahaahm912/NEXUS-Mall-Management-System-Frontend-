// Initialize Lucide Icons at the very start
lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
  const entry = document.getElementById("entry-screen");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  // Load saved theme from local storage
  const savedTheme = localStorage.getItem("nexus-theme") || "light";
  body.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);

  // Entry Screen Timeout
  if (entry) {
    setTimeout(() => {
      entry.classList.add("fade-out");
      setTimeout(() => {
        entry.style.display = "none";
      }, 1000);
    }, 2500);
  }

  // Theme toggle click
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("nexus-theme", newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.replace("bi-moon-stars", "bi-sun-fill");
    } else {
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars");
    }
  }
});
