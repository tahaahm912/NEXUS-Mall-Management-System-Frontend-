// --- 1. DATA & THEME INIT ---
const themeToggle = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");

// Load staff and reviews from local storage
let staffData = JSON.parse(localStorage.getItem("nexus_staff")) || [
    { id: 1, name: "George Bennett", role: "Head Clerk", joined: "Jan 2023", attendance: "08:55 AM (On Time)", status: "Active", initial: "G", color: "#eef2ff", lastPaid: "Dec 01, 2024" },
    { id: 2, name: "Margaret Thompson", role: "Inventory Manager", joined: "Mar 2023", attendance: "09:15 AM (Late)", status: "Active", initial: "M", color: "#fff1f2", lastPaid: "Dec 01, 2024" }
];

let upcomingReviews = JSON.parse(localStorage.getItem("nexus_reviews")) || [
    { id: 1, name: "Harold Miller", type: "Annual Performance", date: "2025-12-12" }
];

const applyTheme = (theme) => {
    if (theme === "dark") {
        document.body.classList.add("dark-theme");
        themeIcon.className = "bi bi-sun-fill fs-5";
    } else {
        document.body.classList.remove("dark-theme");
        themeIcon.className = "bi bi-moon-stars-fill fs-5";
    }
};

const saveAndRender = () => {
    localStorage.setItem("nexus_staff", JSON.stringify(staffData));
    localStorage.setItem("nexus_reviews", JSON.stringify(upcomingReviews));
    renderTable();
    renderReviews();
    updatePayrollUI();
};

// --- 2. RENDERING FUNCTIONS ---
const renderTable = () => {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;

    tbody.innerHTML = staffData.map(member => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div class="avatar-circle" style="background: ${member.color}; color: #0033FF;">${member.initial}</div>
                    <div>
                        <p class="mb-0 fw-bold">${member.name}</p>
                        <p class="small text-muted mb-0">Joined: ${member.joined}</p>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-light text-dark border fw-semibold">${member.role}</span></td>
            <td><span class="status-badge ${member.attendance.includes("Late") ? "status-late" : "status-present"}">${member.attendance}</span></td>
            <td>${member.lastPaid}</td>
            <td><span class="badge rounded-pill bg-success">${member.status}</span></td>
            <td class="text-end">
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action" onclick="paySingle(${member.id})" title="Pay"><i class="bi bi-currency-dollar"></i></button>
                    <button class="btn-action text-danger" onclick="removeStaff(${member.id})" title="Delete"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join("");
};

const renderReviews = () => {
    const reviewContainer = document.querySelector(".col-md-6:last-child .card");
    const reviewList = upcomingReviews.map(rev => {
        const dateObj = new Date(rev.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        return `
            <div class="d-flex align-items-center gap-3 mb-2">
                <div class="bg-info-subtle text-info px-2 py-1 rounded small fw-bold">${day} ${month}</div>
                <p class="mb-0 fw-semibold">${rev.name} (${rev.type})</p>
            </div>
        `;
    }).join("");
    
    // Keep the title and button, replace the middle content
    const title = '<h5 class="fw-bold mb-3">Upcoming Reviews</h5>';
    const button = '<button class="btn btn-light w-100 fw-bold mt-auto" id="scheduleBtn">Schedule Review</button>';
    reviewContainer.innerHTML = title + (reviewList || '<p class="text-muted">No reviews scheduled</p>') + button;
    
    // Re-attach listener to the newly rendered button
    document.getElementById("scheduleBtn").addEventListener("click", openReviewModal);
};

const updatePayrollUI = () => {
    const todayStr = new Date().toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' });
    const paidCount = staffData.filter(s => s.lastPaid === todayStr).length;
    const percentage = staffData.length > 0 ? Math.round((paidCount / staffData.length) * 100) : 0;
    
    const progressBar = document.querySelector(".progress-bar");
    const progressText = document.querySelector(".progress + p");
    
    if (progressBar) progressBar.style.width = percentage + "%";
    if (progressText) progressText.innerText = `${percentage}% of staff have been paid for the current cycle.`;
};

// --- 3. MODAL LOGIC ---
const modal = document.getElementById("customModal");
const addStaffFields = document.getElementById("addStaffFields");
const scheduleFields = document.getElementById("scheduleFields");

// Add Staff Modal
document.querySelector(".btn-primary").addEventListener("click", () => {
    modal.style.display = "flex";
    addStaffFields.style.display = "block";
    scheduleFields.style.display = "none";
    document.getElementById("modalTitle").innerText = "Add New Staff";
    document.getElementById("modalSubmitBtn").onclick = submitNewStaff;
});

function openReviewModal() {
    modal.style.display = "flex";
    addStaffFields.style.display = "none";
    scheduleFields.style.display = "block";
    document.getElementById("modalTitle").innerText = "Schedule Performance Review";
    document.getElementById("modalSubmitBtn").onclick = submitReview;
}

function closeModal() {
    modal.style.display = "none";
}

function submitNewStaff() {
    const name = document.getElementById("staffName").value;
    const role = document.getElementById("staffRole").value;

    if (name && role) {
        staffData.push({
            id: Date.now(),
            name, role,
            joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            attendance: "09:00 AM (Pending)",
            status: "Active",
            initial: name.charAt(0).toUpperCase(),
            color: "#eef2ff",
            lastPaid: "Pending"
        });
        saveAndRender();
        closeModal();
        document.getElementById("staffName").value = "";
        document.getElementById("staffRole").value = "";
    }
}

function submitReview() {
    const date = document.getElementById("reviewDate").value;
    if (date) {
        upcomingReviews.push({
            id: Date.now(),
            name: "New Review", // You could add an input for name/type in HTML
            type: "Performance",
            date: date
        });
        saveAndRender();
        closeModal();
    }
}

// --- 4. ACTION FUNCTIONS ---

window.paySingle = (id) => {
    const staff = staffData.find(s => s.id === id);
    if (confirm(`Process payment for ${staff.name}?`)) {
        staff.lastPaid = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        saveAndRender();
    }
};

document.querySelector(".btn-outline-primary.w-100").addEventListener("click", () => {
    if (confirm("Process payroll for all active employees?")) {
        const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        staffData.forEach(s => s.lastPaid = today);
        saveAndRender();
    }
});

window.removeStaff = (id) => {
    if (confirm("Remove this employee?")) {
        staffData = staffData.filter(s => s.id !== id);
        saveAndRender();
    }
};

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme(isDark ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem("theme"));
    saveAndRender(); // Initial render
});