// --- 8. DARK MODE LOGIC ---
const themeBtn = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
updateIcon(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });
}

function updateIcon(theme) {
  if (!themeIcon) return;
  if (theme === "dark") {
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    themeIcon.style.color = "#ffcc00";
  } else {
    themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    themeIcon.style.color = "";
  }
}

  // 2. Notification Logic
  const form = document.getElementById("broadcastForm");
  const historyContainer = document.getElementById("historyTimeline");

  function renderNotification(noti) {
    const html = `
            <div class="list-group-item p-4 border-0 mb-2 rounded-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-${noti.level}-subtle text-${noti.level} border-0 rounded-pill px-3 py-2 small">${noti.audience}</span>
                    <span class="text-muted small">${noti.time}</span>
                </div>
                <h6 class="fw-bold mb-1">${noti.subject}</h6>
                <p class="text-muted small mb-0">${noti.detail}</p>
            </div>
        `;
    historyContainer.insertAdjacentHTML("afterbegin", html);
  }

  function loadNotifications() {
    const notifications =
      JSON.parse(localStorage.getItem("nexus-notifications")) || [];
    // If empty, you can keep your default placeholders or leave it clear
    notifications.forEach((noti) => renderNotification(noti));
  }

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const selectedAudiences = Array.from(
        document.querySelectorAll('input[name="audience"]:checked')
      ).map((cb) => cb.value);

      if (selectedAudiences.length === 0) {
        alert("Please select at least one recipient group.");
        return;
      }

      const newNoti = {
        audience: selectedAudiences.join(", "),
        subject: document.getElementById("notiSubject")?.value || "No Subject",
        level:
          document.querySelector("select")?.value.toLowerCase().trim() ||
          "info",
        detail: document.getElementById("notiDetail")?.value || "",
        time: "Just now",
      };

      const notifications =
        JSON.parse(localStorage.getItem("nexus-notifications")) || [];
      notifications.push(newNoti);
      localStorage.setItem(
        "nexus-notifications",
        JSON.stringify(notifications)
      );

      renderNotification(newNoti);
      form.reset();
    };
  }

  loadNotifications();
;
