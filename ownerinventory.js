/**
 * NexusMMS Inventory & Shop Management System
 * Features: Dark Mode, LocalStorage Persistence, Search, CRUD, Modal Add
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. INITIALIZATION & DATA ---

  // Load products from Local Storage or use defaults
  let products = JSON.parse(localStorage.getItem("nexus_inventory")) || [
    {
      id: 1,
      name: "Premium Canned Peaches",
      sku: "#CP-9901",
      cat: "Groceries",
      price: "2.45",
      qty: 42,
    },
    {
      id: 2,
      name: "Aged Kentucky Bourbon",
      sku: "#ALC-4421",
      cat: "Dry Goods",
      price: "18.00",
      qty: 5,
    },
    {
      id: 3,
      name: "Handmade Wool Blankets",
      sku: "#TEX-2200",
      cat: "Hardware",
      price: "12.50",
      qty: 15,
    },
  ];

  const tbody = document.querySelector("table tbody");
  const searchInput = document.querySelector(".input-group input");
  const categorySelect = document.querySelector(".form-select");
  const themeToggle = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const addProductForm = document.getElementById("addProductForm");

  // Initialize Bootstrap Modal Instance
  const addModalElement = document.getElementById("addProductModal");
  const addModal = addModalElement
    ? new bootstrap.Modal(addModalElement)
    : null;

  // --- 2. THEME LOGIC ---

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

  applyTheme(localStorage.getItem("nexus_theme") || "light");

  // --- 3. RENDERING & TABLE LOGIC ---

  window.renderProducts = (data = products) => {
    if (!tbody) return;
    tbody.innerHTML = "";
    data.forEach((p) => {
      let statusClass = "stock-good";
      let statusText = "Healthy";
      if (p.qty <= 5) {
        statusClass = "stock-low";
        statusText = "Low Stock";
      } else if (p.qty <= 15) {
        statusClass = "stock-mid";
        statusText = "Warning";
      }
      tbody.innerHTML += `
                <tr>
                    <td class="ps-4 fw-bold">${p.name}</td>
                    <td class="text-muted">${p.sku}</td>
                    <td>${p.cat}</td>
                    <td>$${parseFloat(p.price).toFixed(2)}</td>
                    <td>${p.qty} units</td>
                    <td><span class="stock-indicator ${statusClass}"></span> ${statusText}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteProduct(${
                          p.id
                        })">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
    });
  };

  // --- 4. CRUD OPERATIONS ---

  // Add Product via Modal
  if (addProductForm) {
    addProductForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newProduct = {
        id: Date.now(), // Unique ID
        name: document.getElementById("p-name").value,
        sku: document.getElementById("p-sku").value,
        cat: document.getElementById("p-cat").value,
        price: document.getElementById("p-price").value,
        qty: parseInt(document.getElementById("p-qty").value),
      };

      products.push(newProduct);
      saveAndRefresh();

      addProductForm.reset();
      addModal.hide();
      showToast("Product added to inventory");
    });
  }

  // Delete Product
  window.deleteProduct = (id) => {
    if (confirm("Are you sure you want to remove this item?")) {
      products = products.filter((p) => p.id !== id);
      saveAndRefresh();
      showToast("Item removed");
    }
  };

  // Edit Product (Placeholder - could be expanded to a modal)
  window.editProduct = (id) => {
    const p = products.find((prod) => prod.id === id);
    showToast(`Editing ${p.name}...`);
    // You can add logic here to fill a modal with 'p' data
  };

  // --- 5. UTILITIES (Search, Toast, Persistence) ---

  function saveAndRefresh() {
    localStorage.setItem("nexus_inventory", JSON.stringify(products));
    window.renderProducts();
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "custom-alert-popup";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // Search Logic
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
      );
      window.renderProducts(filtered);
    });
  }

  // Category Filter Logic
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      const cat = e.target.value;
      if (cat === "All Categories") {
        window.renderProducts();
      } else {
        const filtered = products.filter((p) => p.cat === cat);
        window.renderProducts(filtered);
      }
    });
  }

  // Initial Render
  window.renderProducts();
});
