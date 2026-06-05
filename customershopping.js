document.addEventListener("DOMContentLoaded", () => {
    // --- 1. THEME PERSISTENCE ---
    const themeToggle = document.getElementById("dark-mode-toggle");
    const themeIcon = document.getElementById("theme-icon");

    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("nexus-theme", theme);
        if (themeIcon) {
            themeIcon.className = theme === "dark" ? "bi bi-sun-fill fs-5" : "bi bi-moon-stars-fill fs-5";
        }
    };

    applyTheme(localStorage.getItem("nexus-theme") || "light");

    themeToggle.addEventListener("click", () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(newTheme);
    });

    // --- 2. MODAL & DATA HANDLING ---
    const dealModal = new bootstrap.Modal(document.getElementById('dealModal'));
    const enquiryModal = new bootstrap.Modal(document.getElementById('enquiryModal'));
    
    let currentDealBtn = null;
    let currentItemName = "";

    // Load claimed items from LocalStorage on startup
    const updateUIFromStorage = () => {
        const claimed = JSON.parse(localStorage.getItem("claimedDeals") || "[]");
        document.querySelectorAll(".shop-card").forEach(card => {
            const title = card.querySelector("h6")?.innerText;
            const btn = card.querySelector(".btn-primary");
            if (btn && claimed.some(d => d.item === title)) {
                btn.innerText = "Claimed";
                btn.disabled = true;
                btn.classList.replace("btn-primary", "btn-outline-secondary");
            }
        });
    };
    updateUIFromStorage();

    // --- 3. EVENT LISTENERS ---

    // Flash Deal Button Click
    document.querySelectorAll(".shop-card .btn-primary").forEach((btn) => {
        btn.addEventListener("click", function() {
            currentDealBtn = this;
            currentItemName = this.closest(".p-4").querySelector("h6").innerText;
            document.getElementById("modalDealTitle").innerText = `Claim ${currentItemName}?`;
            dealModal.show();
        });
    });

    // Confirm Claim inside Modal
    document.getElementById("confirmClaimBtn").addEventListener("click", () => {
        if (currentDealBtn) {
            // Save to Local Storage
            let claimed = JSON.parse(localStorage.getItem("claimedDeals") || "[]");
            claimed.push({ item: currentItemName, date: new Date().toLocaleString() });
            localStorage.setItem("claimedDeals", JSON.stringify(claimed));

            // Update UI
            currentDealBtn.innerText = "Claimed";
            currentDealBtn.disabled = true;
            currentDealBtn.classList.replace("btn-primary", "btn-outline-secondary");
            
            dealModal.hide();
            showAlert(`Success! ${currentItemName} added to your account.`);
        }
    });

    // Enquiry Button Click
    document.querySelectorAll(".btn-dark").forEach((btn) => {
        btn.addEventListener("click", function() {
            const shopName = this.closest(".col").querySelector("h6").innerText;
            document.getElementById("enquiryShopName").innerText = shopName;
            enquiryModal.show();
        });
    });

    // Enquiry Form Submit
    document.getElementById("enquiryForm").addEventListener("submit", (e) => {
        e.preventDefault();
        enquiryModal.hide();
        showAlert("Enquiry sent successfully!");
    });

    // Custom Alert Helper
    function showAlert(message) {
        const alertBox = document.createElement("div");
        alertBox.className = "custom-alert";
        alertBox.innerHTML = `<i class="bi bi-check2-circle fs-4"></i> <span>${message}</span>`;
        document.body.appendChild(alertBox);
        setTimeout(() => {
            alertBox.style.opacity = "0";
            setTimeout(() => alertBox.remove(), 500);
        }, 3000);
    }
});