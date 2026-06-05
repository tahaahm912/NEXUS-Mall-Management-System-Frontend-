document.addEventListener("DOMContentLoaded", () => {
    // --- 1. THEME PERSISTENCE ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("nexus-theme", theme);
        const icon = document.getElementById("theme-icon");
        if (icon) {
            icon.className = theme === "dark" ? "bi bi-sun-fill fs-5" : "bi bi-moon-stars-fill fs-5";
        }
    };

    applyTheme(localStorage.getItem("nexus-theme") || "light");

    const themeToggle = document.getElementById("dark-mode-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(newTheme);
        });
    }

    // --- 2. MULTI-FILTER SEARCH (TEXT + DROPDOWNS) ---
    const searchInput = document.querySelector('input[placeholder="Search job titles or keywords..."]');
    const selects = document.querySelectorAll(".form-select");
    const categorySelect = selects[0]; // All Categories
    const typeSelect = selects[1];     // Job Type
    const jobCards = document.querySelectorAll(".job-card:not(.border-dashed)");

    const filterJobs = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryTerm = categorySelect.value.toLowerCase();
        const typeTerm = typeSelect.value.toLowerCase();

        jobCards.forEach((card) => {
            const title = card.querySelector("h5").innerText.toLowerCase();
            const badge = card.querySelector(".job-badge").innerText.toLowerCase();
            const description = card.querySelector(".text-muted").innerText.toLowerCase();
            const parentCol = card.closest(".col-md-6, .col-xl-4");

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = categoryTerm === "all categories" || description.includes(categoryTerm) || title.includes(categoryTerm);
            const matchesType = typeTerm === "job type" || badge.includes(typeTerm);

            if (matchesSearch && matchesCategory && matchesType) {
                parentCol.style.display = "block";
            } else {
                parentCol.style.display = "none";
            }
        });

        // Update active job count for dashboard
        const visibleCount = Array.from(jobCards).filter(c => c.closest(".col-md-6, .col-xl-4").style.display !== "none").length;
        localStorage.setItem("activeJobCount", visibleCount);
    };

    if (searchInput) searchInput.addEventListener("input", filterJobs);
    if (categorySelect) categorySelect.addEventListener("change", filterJobs);
    if (typeSelect) typeSelect.addEventListener("change", filterJobs);


    // --- 3. MODAL & LOCAL STORAGE LOGIC ---
    const modalEl = document.getElementById('applyModal');
    let applyModal = null;
    
    // Initialize Bootstrap Modal safely
    if (modalEl) {
        applyModal = new bootstrap.Modal(modalEl);
    }

    let currentJobCard = null;

    // Handle "Apply" button clicks
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("apply-trigger")) {
            currentJobCard = e.target.closest(".job-card");
            const jobTitle = currentJobCard.querySelector("h5").innerText;
            const company = currentJobCard.querySelector(".text-primary").innerText;
            const iconHtml = currentJobCard.querySelector(".company-logo-placeholder").innerHTML;

            // Fill Modal Data
            document.getElementById("modalJobTitle").innerText = jobTitle;
            document.getElementById("modalCompany").innerText = company;
            document.getElementById("modalJobIcon").innerHTML = iconHtml;

            if (applyModal) applyModal.show();
        }
    });

    // Handle Form Submission
    const appForm = document.getElementById("jobApplicationForm");
    if (appForm) {
        appForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const jobTitle = document.getElementById("modalJobTitle").innerText;
            
            // 1. Prepare Data for Local Storage
            const newApplication = {
                id: Date.now(),
                job: jobTitle,
                company: document.getElementById("modalCompany").innerText,
                applicant: document.getElementById("applicantName").value,
                date: new Date().toLocaleDateString(),
                status: "Submitted"
            };

            // 2. Save to Local Storage
            const savedApps = JSON.parse(localStorage.getItem("myApplications") || "[]");
            savedApps.push(newApplication);
            localStorage.setItem("myApplications", JSON.stringify(savedApps));

            // 3. Update UI (Visual Feedback)
            if (currentJobCard) {
                const btn = currentJobCard.querySelector(".apply-trigger");
                btn.innerText = "Applied";
                btn.className = "btn btn-success btn-sm rounded-pill px-3 disabled";
                btn.classList.remove("apply-trigger");
            }

            // 4. Close Modal and Notify
            if (applyModal) applyModal.hide();
            
            // Create a custom alert (using your existing CSS)
            const alertBox = document.createElement("div");
            alertBox.className = "custom-alert show";
            alertBox.innerHTML = `<strong>Success!</strong> Application sent for ${jobTitle}`;
            document.body.appendChild(alertBox);
            
            setTimeout(() => {
                alertBox.classList.remove("show");
                setTimeout(() => alertBox.remove(), 500);
            }, 3000);

            this.reset();
        });
    }

    // Run initial count
    localStorage.setItem("activeJobCount", jobCards.length);
});