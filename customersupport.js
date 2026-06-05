document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const complaintForm = document.getElementById("complaintForm");

  // 1. THEME MANAGEMENT (PERSISTENT)
  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-theme");
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    } else {
      body.classList.remove("dark-theme");
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    }
  };

  // Load saved theme on page load
  const savedTheme = localStorage.getItem("nexus-theme") || "light";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const newTheme = body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem("nexus-theme", newTheme);
    applyTheme(newTheme);
  });

  // 2. STYLED POPUP FUNCTION
  const showNotification = (message) => {
    const alertBox = document.createElement("div");
    alertBox.className = "custom-alert";
    alertBox.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 500);
    }, 3000);
  };

  // 3. COMPLAINT FORM & LOCAL STORAGE
  complaintForm.onsubmit = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector("button");

    // Get form data
    const newTicket = {
      id: "#TKT-" + Math.floor(1000 + Math.random() * 9000),
      subject: e.target.querySelector('input[type="text"]').value,
      category: e.target.querySelector("select").value,
      date: "Just now",
      status: "IN REVIEW",
    };

    btn.innerText = "Processing...";
    btn.disabled = true;

    // Save to local storage
    const tickets = JSON.parse(localStorage.getItem("user-tickets") || "[]");
    tickets.unshift(newTicket);
    localStorage.setItem("user-tickets", JSON.stringify(tickets));

    setTimeout(() => {
      showNotification(`Success! Ticket ${newTicket.id} created.`);
      btn.innerText = "Submit Complaint";
      btn.disabled = false;
      e.target.reset();
      // Optional: You could write a function to refresh the "Recent Tickets" list here
    }, 1200);
  };
});
