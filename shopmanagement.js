document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "nexus_shops_db";

  // 1. DATA INITIALIZATION
  const defaultData = [
    {
      id: "A-102",
      location: "Floor 1",
      size: 450,
      rent: 1200,
      status: "available",
    },
    {
      id: "C-301",
      tenant: "Tech Hub Solutions",
      leaseEnd: "Dec 2025",
      rent: 4500,
      status: "rented",
    },
    {
      applicant: "Gourmet Coffee Co.",
      contact: "Marcus Vane",
      type: "Cafe / F&B",
      date: "Oct 24, 2023",
      status: "reviewing",
    },
  ];

  let shops = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
    renderUI();
  };

  // 2. RENDERING ENGINE
  const renderUI = () => {
    const rentContainer = document.getElementById("rent-container");
    const enlistmentTable = document.getElementById("enlistment-table-body");
    const rentedTable = document.getElementById("rented-table-body");

    if (rentContainer) rentContainer.innerHTML = "";
    if (enlistmentTable) enlistmentTable.innerHTML = "";
    if (rentedTable) rentedTable.innerHTML = "";

    shops.forEach((item, index) => {
      if (item.status === "available" && rentContainer) {
        rentContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="shop-card p-4 h-100 shadow-sm border-0">
                            <div class="d-flex justify-content-between mb-3">
                                <span class="shop-badge badge-available">Available</span>
                                <span class="fw-bold text-primary">$${Number(
                                  item.rent
                                ).toLocaleString()}</span>
                            </div>
                            <h5 class="fw-800">Shop ${item.id}</h5>
                            <p class="text-muted small"><i class="bi bi-geo-alt"></i> ${
                              item.location
                            } • ${item.size} sqft</p>
                            <hr>
                            <button class="btn btn-sm btn-outline-danger w-100" onclick="deleteItem(${index})">Remove Listing</button>
                        </div>
                    </div>`;
      } else if (
        (item.status === "reviewing" || item.status === "pending") &&
        enlistmentTable
      ) {
        enlistmentTable.innerHTML += `
                    <tr>
                        <td><div class="fw-bold">${item.applicant}</div><span class="text-muted x-small">${item.contact}</span></td>
                        <td>${item.type}</td>
                        <td>${item.date}</td>
                        <td><span class="shop-badge badge-pending">${item.status}</span></td>
                        <td class="text-end"><button class="btn btn-sm btn-primary px-3 rounded-pill" onclick="openApprovalModal(${index})">Approve</button></td>
                    </tr>`;
      } else if (item.status === "rented" && rentedTable) {
        rentedTable.innerHTML += `
                    <tr>
                        <td><span class="fw-bold text-primary">${
                          item.id
                        }</span></td>
                        <td>${item.tenant}</td>
                        <td>${item.leaseEnd}</td>
                        <td><strong>$${Number(
                          item.rent
                        ).toLocaleString()}</strong></td>
                        <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${index})">Terminate</button></td>
                    </tr>`;
      }
    });
  };

  // Initial call to render
  renderUI();

  // 3. ACTION HANDLERS
  const addShopForm = document.getElementById("addShopForm");
  if (addShopForm) {
    addShopForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = e.target.querySelectorAll("input");
      shops.push({
        id: inputs[0].value,
        location: e.target.querySelector("select").value,
        size: Math.abs(inputs[1].value),
        rent: Math.abs(inputs[2].value),
        status: "available",
      });
      saveData();
      bootstrap.Modal.getInstance(
        document.getElementById("addShopModal")
      ).hide();
      e.target.reset();
    });
  }

  window.openApprovalModal = (index) => {
    const app = shops[index];
    document.getElementById("approvingTenantName").innerText = app.applicant;
    document.getElementById("approvingIndex").value = index;
    const modal = new bootstrap.Modal(document.getElementById("approvalModal"));
    modal.show();
  };

  const approvalForm = document.getElementById("approvalForm");
  if (approvalForm) {
    approvalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const index = document.getElementById("approvingIndex").value;
      const shopId = document.getElementById("assignShopId").value;
      const rent = document.getElementById("assignRent").value;

      const applicant = shops[index];
      shops[index] = {
        id: shopId,
        tenant: applicant.applicant,
        leaseEnd: "Dec 2026",
        rent: Math.abs(rent),
        status: "rented",
      };

      saveData();
      bootstrap.Modal.getInstance(
        document.getElementById("approvalModal")
      ).hide();

      const tab = new bootstrap.Tab(
        document.querySelector('[data-bs-target="#rented"]')
      );
      tab.show();
    });
  }

  window.deleteItem = (index) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      shops.splice(index, 1);
      saveData();
    }
  };

  // --- LOGOUT LOGIC (Alert Removed) ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Immediately reloads without confirmation
      window.location.reload();
    });
  }

  // Dark Mode
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
    if (themeIcon)
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = htmlElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        htmlElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (themeIcon)
          themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
      } else {
        htmlElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (themeIcon)
          themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
      }
    });
  }
});
