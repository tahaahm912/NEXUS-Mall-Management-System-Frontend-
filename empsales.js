// --- 1. State & Theme Management ---
const themeBtn = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const STORAGE_KEY = "nexus_employee_data";

const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    themeIcon.className = theme === "dark" ? "bi bi-sun-fill fs-5" : "bi bi-moon-stars-fill fs-5";
    localStorage.setItem("nexus_theme", theme);
};
applyTheme(localStorage.getItem("nexus_theme") || "light");

themeBtn.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(newTheme);
});

// --- 2. Sales Logic ---
let currentTotal = 0;
const totalDisplay = document.querySelector(".text-primary.fw-bold");
// Targeting the Subtotal specifically (first span with small fw-bold inside the calculation box)
const subtotalDisplay = document.querySelector(".action-card .p-3 .d-flex:first-child span.fw-bold"); 
const productButtons = document.querySelectorAll(".product-item button");
const customerInput = document.querySelector('.action-card input[type="text"]');
const completeSaleBtn = document.querySelector(".btn-primary.w-100");

productButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
        const priceText = this.parentElement.querySelector(".text-muted").textContent;
        const price = parseFloat(priceText.replace("$", ""));

        currentTotal += price;
        updateDisplay();

        this.innerHTML = '<i class="bi bi-check text-success"></i>';
        setTimeout(() => { this.innerHTML = '<i class="bi bi-plus"></i>'; }, 500);
    });
});

function updateDisplay() {
    const formatted = `$${currentTotal.toFixed(2)}`;
    totalDisplay.textContent = formatted;
    if(subtotalDisplay) subtotalDisplay.textContent = formatted;
}

completeSaleBtn.addEventListener("click", () => {
    if (currentTotal === 0) { alert("Please add at least one item to the sale."); return; }
    if (!customerInput.value.trim()) { alert("Please enter a Customer Name or ID."); return; }

    let empData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { activities: [], stats: { tasks: 0 } };
    const newActivity = {
        type: "Sale Completed",
        message: `${customerInput.value} - Total: $${currentTotal.toFixed(2)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: "bi-cart-check-fill",
        color: "text-success",
    };

    empData.activities.unshift(newActivity);
    empData.stats.tasks += 1; 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empData));

    alert("Sale Processed Successfully!");
    currentTotal = 0;
    customerInput.value = "";
    updateDisplay();
});

// --- 3. Search Functionality ---
const searchInput = document.querySelector('input[placeholder="Search customer UID..."]');
searchInput.addEventListener("input", function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll(".reservation-table tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
    });
});

// --- 4. Sort Functionality ---
const sortLinks = document.querySelectorAll(".dropdown-menu .dropdown-item");
sortLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const sortType = this.textContent.trim();
        const tbody = document.querySelector(".reservation-table tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));

        if (sortType === "Today") {
            // Filter logic: show only rows that contain "Today"
            rows.forEach(row => {
                row.style.display = row.innerText.includes("Today") ? "" : "none";
            });
        } else if (sortType === "Pending") {
            // Filter logic: show only "In-Progress"
            rows.forEach(row => {
                row.style.display = row.innerText.includes("In-Progress") ? "" : "none";
            });
        } else {
            // Reset view
            rows.forEach(row => row.style.display = "");
        }
        
        // Update the dropdown label to show current filter
        document.querySelector(".dropdown-toggle").textContent = `Sort: ${sortType}`;
        updateReservationCount();
    });
});

// --- 5. Reservation Actions ---
const reservationButtons = document.querySelectorAll(".btn-complete");
const countDisplay = document.querySelector(".bi-info-circle").parentElement;

reservationButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
        const row = this.closest("tr");
        const customerName = row.querySelector(".fw-bold.small").textContent;

        if (confirm(`Mark reservation for ${customerName} as completed?`)) {
            row.style.transition = "0.3s";
            row.style.opacity = "0";
            setTimeout(() => {
                row.remove();
                updateReservationCount();
                
                // Track this as a task completion in local storage
                let empData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { activities: [], stats: { tasks: 0 } };
                empData.stats.tasks += 1;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(empData));
            }, 300);
        }
    });
});

function updateReservationCount() {
    const visibleRows = document.querySelectorAll(".reservation-table tbody tr:not([style*='display: none'])").length;
    countDisplay.innerHTML = `<i class="bi bi-info-circle me-1"></i> Total ${visibleRows} reservations found.`;
}

// --- 6. Logout ---
document.getElementById("logoutBtn").addEventListener("click", (e) => {
    if (!confirm("Logout and end session?")) e.preventDefault();
});