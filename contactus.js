document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;
  const contactForm = document.getElementById("contact-form");
  const alertBox = document.getElementById("alert-box");

  // --- Theme Handling ---
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.replace("bi-moon-stars", "bi-sun-fill");
    } else {
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars");
    }
  }

  // --- Form Handling & Local Storage ---
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capture data
    const formData = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
      timestamp: new Date().toISOString(),
    };

    // Store in Local Storage
    // We retrieve existing messages or start a new array
    const existingMessages =
      JSON.parse(localStorage.getItem("nexus_contact_messages")) || [];
    existingMessages.push(formData);
    localStorage.setItem(
      "nexus_contact_messages",
      JSON.stringify(existingMessages)
    );

    // UI Feedback
    alertBox.style.display = "block";
    contactForm.reset();

    // Hide alert after 3 seconds
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 3000);

    console.log("Message saved to localStorage:", formData);
  });
});
