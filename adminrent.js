document.addEventListener("DOMContentLoaded", function () {
  // === SIDEBAR LOGIC ===
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const toggleBtn = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("closeSidebar");

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (toggleBtn)
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSidebar();
    });
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeSidebar();
  });

  // === REVENUE & RENT LOGIC ===
  const STORAGE_KEY = "nexus_shops";
  const tableBody = document.getElementById("rentTableBody");

  // Default data if LocalStorage is empty
  function getShops() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    const defaultShops = [
      {
        id: "A-101",
        tenant: "Apex Retailers Ltd.",
        rent: 2400,
        status: "Paid",
        dueDate: "05 Oct 2025",
      },
      {
        id: "B-204",
        tenant: "Fashion Forward",
        rent: 1850,
        status: "Overdue",
        dueDate: "05 Oct 2025",
      },
      {
        id: "C-301",
        tenant: "Tech Haven",
        rent: 3200,
        status: "Pending",
        dueDate: "10 Oct 2025",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShops));
    return defaultShops;
  }

  function renderRentData() {
    const shops = getShops();
    tableBody.innerHTML = "";

    let totalVal = 0;
    let paidVal = 0;

    shops.forEach((shop, index) => {
      const rent = parseFloat(shop.rent) || 0;
      totalVal += rent;
      if (shop.status === "Paid") paidVal += rent;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td><span class="fw-bold">${shop.id}</span></td>
                <td>${shop.tenant || "Vacant"}</td>
                <td>$${rent.toLocaleString()}</td>
                <td>${shop.dueDate || "N/A"}</td>
                <td><span class="badge-status ${getStatusClass(shop.status)}">${
        shop.status
      }</span></td>
                <td class="text-end">
                    ${
                      shop.status !== "Paid"
                        ? `<button class="btn btn-sm btn-primary px-3 rounded-pill collect-btn" data-index="${index}" style="background: var(--color-blue); border: none;">Collect</button>`
                        : `<button class="btn btn-sm btn-light border" title="Receipt"><i class="bi bi-file-earmark-text"></i></button>`
                    }
                </td>
            `;
      tableBody.appendChild(row);
    });

    // Update Stat Cards
    document.getElementById(
      "totalProjectedRevenue"
    ).innerText = `$${totalVal.toLocaleString()}.00`;
    const pending = totalVal - paidVal;
    document.getElementById(
      "pendingCollection"
    ).innerText = `$${pending.toLocaleString()}`;

    const percent = totalVal > 0 ? Math.round((paidVal / totalVal) * 100) : 0;
    document.getElementById("revenueProgressBar").style.width = percent + "%";
    document.getElementById("collectionPercent").innerText = percent;
  }

  function getStatusClass(status) {
    if (status === "Paid") return "badge-paid";
    if (status === "Overdue") return "badge-unpaid";
    return "badge-pending";
  }

  // Event Listener for Collect Button
  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("collect-btn")) {
      const index = e.target.dataset.index;
      const shops = getShops();
      shops[index].status = "Paid";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
      renderRentData();
      alert("Payment collected successfully!");
    }
  });

  renderRentData();
});

// --- DARK MODE LOGIC ---
const themeToggle = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

// Check Local Storage on Load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  htmlElement.setAttribute("data-theme", "dark");
  if (themeIcon)
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
}

// Toggle Event
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = htmlElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      htmlElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    } else {
      htmlElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    }
  });
}
