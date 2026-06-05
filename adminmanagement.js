document.addEventListener("DOMContentLoaded", function () {
  // 1. MATCH THE STORAGE KEY TO YOUR LOGIN PAGE
  const STORAGE_KEY = "nexus_admins";

  function getAdmins() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveAdmins(admins) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
  }

  function renderAdmin(admin) {
    const row = document.createElement("tr");
    // Store username in dataset for deletion logic
    row.dataset.username = admin.username;

    row.innerHTML = `
      <td>
        <div class="fw-bold">${admin.fullName || admin.name}</div>
        <div class="text-muted x-small">${admin.username}</div>
      </td>
      <td>${admin.lastActive || "Just now"}</td>
      <td><span class="text-success fw-bold">Active</span></td>
      <td class="text-end text-nowrap">
        <button class="btn-action permissions" title="Manage Permissions"
          data-bs-toggle="modal" data-bs-target="#permissionsModal">
          <i class="bi bi-gear-wide-connected"></i>
        </button>
        <button class="btn-action ms-1" title="Change Password"
          data-bs-toggle="modal" data-bs-target="#changePasswordModal">
          <i class="bi bi-shield-lock"></i>
        </button>
        <button class="btn-action delete ms-1" title="Remove User">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    return row;
  }

  // ELEMENT REFERENCES
  const searchInput = document.getElementById("adminSearchInput");
  const tableBody = document.querySelector("#adminListTable tbody");
  const addAdminForm = document.getElementById("addAdminForm");
  const changePassForm = document.getElementById("changePasswordForm");
  const permissionsForm = document.getElementById("permissionsForm");

  // LOAD ADMINS ON PAGE LOAD
  const savedAdmins = getAdmins();
  savedAdmins.forEach((admin) => {
    tableBody.appendChild(renderAdmin(admin));
  });

  // SEARCH FUNCTIONALITY
  searchInput.addEventListener("keyup", function () {
    const term = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => {
      row.style.display = row.innerText.toLowerCase().includes(term)
        ? ""
        : "none";
    });
  });

  // =========================
  // ADD NEW ADMIN (FIXED)
  // =========================
  addAdminForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("newAdminName").value.trim();
    const emailInput = document.getElementById("newAdminEmail").value.trim();
    const passInput = document.getElementById("newAdminPass").value;

    let admins = getAdmins();

    // Fix: Check against 'username' property to prevent "exists" error
    // We use .toLowerCase() to make the check case-insensitive
    const exists = admins.find(
      (a) => a.username && a.username.toLowerCase() === emailInput.toLowerCase()
    );

    if (exists) {
      alert("Admin with this Username/Email already exists!");
      return;
    }

    // CREATE OBJECT (Matches Signup/Login properties)
    const newAdmin = {
      fullName: nameInput,
      username: emailInput, // Login 'l1' checks this
      password: passInput, // Login 'l2' checks this
      lastActive: "Just now",
    };

    admins.push(newAdmin);
    saveAdmins(admins);

    tableBody.appendChild(renderAdmin(newAdmin));

    // Hide Modal
    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("addAdminModal")
    );
    if (modalInstance) modalInstance.hide();

    addAdminForm.reset();
    alert("New Administrator added! They can now login.");
  });

  // =========================
  // DELETE ADMIN (FIXED)
  // =========================
  tableBody.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".delete");
    if (!deleteBtn) return;

    if (!confirm("Are you sure you want to remove this administrator?")) return;

    const row = deleteBtn.closest("tr");
    const usernameToDelete = row.dataset.username;

    let admins = getAdmins();
    admins = admins.filter((a) => a.username !== usernameToDelete);
    saveAdmins(admins);

    row.remove();
  });

  // CHANGE PASSWORD (UI ONLY)
  changePassForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Password updated successfully!");
    bootstrap.Modal.getInstance(
      document.getElementById("changePasswordModal")
    ).hide();
    changePassForm.reset();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // --- THEME TOGGLE LOGIC ---
  const themeBtn = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  // Load from Local Storage
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeUI(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeUI(newTheme);
    });
  }

  function updateThemeUI(theme) {
    if (!themeIcon) return;
    if (theme === "dark") {
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
      themeIcon.style.color = "#ffcc00";
    } else {
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
      themeIcon.style.color = "";
    }
  }

  // --- YOUR EXISTING ADMIN MANAGEMENT LOGIC BELOW ---
  const STORAGE_KEY = "nexus_admins";
  // ... (rest of your existing script remains exactly the same)
});
