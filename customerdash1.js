document.addEventListener("DOMContentLoaded", () => {
  // --- 1. THEME MANAGEMENT ---
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nexus-theme", theme);

    if (themeIcon) {
      if (theme === "dark") {
        themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
      } else {
        themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
      }
    }
  };

  const savedTheme = localStorage.getItem("nexus-theme") || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  // --- 2. DATA PERSISTENCE ---
  const defaultData = {
    userName: "Taha Ahmed",
    points: 1250,
    events: 2,
    jobs: 1,
  };

  if (!localStorage.getItem("nexus-user-data")) {
    localStorage.setItem("nexus-user-data", JSON.stringify(defaultData));
  }

  // --- 3. UI INTERACTIVITY & TOASTS ---
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "custom-alert";
    toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const markReadBtn = document.querySelector(".notification-header a");
  if (markReadBtn) {
    markReadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const badge = document.querySelector(".notification-badge");
      if (badge) badge.style.display = "none";
      showToast("All notifications marked as read");
    });
  }

  // --- 4. LOGOUT LOGIC (Alert Removed) ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    // Find the parent link or use the button directly
    const logoutLink = logoutBtn.closest("a") || logoutBtn;
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Perform immediate logout action (e.g., redirect to home)
      window.location.href = "mainlogin.html";
    });
  }

  // --- 5. NUMBER ANIMATION ---
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      element.innerHTML = currentCount.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const stats = document.querySelectorAll(".stat-card h3");
  stats.forEach((stat) => {
    const valueText = stat.innerText.replace(/,/g, "");
    const targetValue = parseInt(valueText) || 0;
    animateValue(stat, 0, targetValue, 1500);
  });

  // --- 6. CLEAR SECTION LOGIC ---
  const feedbackBtn = document.querySelector("button.btn-primary.w-100");
  if (
    (feedbackBtn && feedbackBtn.innerText.includes("Feedback")) ||
    feedbackBtn
  ) {
    // Only modify if it hasn't been modified yet
    if (feedbackBtn.innerText !== "Section Cleared") {
      feedbackBtn.innerText = "Clear Section";
      feedbackBtn.style.background = "#64748b";
      feedbackBtn.style.border = "none";
    }

    feedbackBtn.addEventListener("click", () => {
      const communicationCard = feedbackBtn.closest(".card");
      const itemsToClear = communicationCard.querySelectorAll(
        ".d-flex.gap-3.mb-3, .border-bottom"
      );

      itemsToClear.forEach((item) => {
        item.style.transition = "all 0.4s ease";
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        setTimeout(() => item.remove(), 400);
      });

      showToast("Communication section cleared.");
      feedbackBtn.disabled = true;
      feedbackBtn.innerText = "Section Cleared";
    });
  }
});
