document.addEventListener("DOMContentLoaded", () => {
    // --- 1. THEME LOGIC ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("nexus-theme", theme);
        const icon = document.getElementById("theme-icon");
        if (icon) icon.className = theme === "dark" ? "bi bi-sun-fill fs-5" : "bi bi-moon-stars-fill fs-5";
    };
    applyTheme(localStorage.getItem("nexus-theme") || "light");

    document.getElementById("dark-mode-toggle").addEventListener("click", () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(newTheme);
    });

    // --- 2. MODAL INITIALIZATION ---
    const modalEl = document.getElementById('eventModal');
    let eventModal = null;
    if (typeof bootstrap !== 'undefined' && modalEl) {
        eventModal = new bootstrap.Modal(modalEl);
    }

    let activeLink = null;

    // --- 3. THE "ALL BUTTONS" FIX ---
    document.addEventListener("click", (e) => {
        // Find if the clicked element is a link OR our special hero button
        const trigger = e.target.closest("a") || e.target.closest(".register-trigger");
        if (!trigger) return;

        const text = trigger.innerText.trim().toLowerCase();

        // Check if it's any of our registration types
        if (text.includes("register") || text.includes("get free pass") || text.includes("remind me") || text.includes("details")) {
            e.preventDefault();
            activeLink = trigger;

            let eventTitle, eventLocation;

            // Check if it's the Hero Button or a Card Link
            const card = trigger.closest(".event-card");
            if (card) {
                // Logic for Grid Cards
                eventTitle = card.querySelector("h5").innerText;
                eventLocation = card.querySelector(".bi-geo-alt").parentElement.innerText;
            } else {
                // Logic for the Hero Section (Featured Event)
                const heroSection = trigger.closest(".featured-event");
                eventTitle = heroSection.querySelector("h1").innerText;
                eventLocation = "Main Event Hall"; // Default location for hero
            }

            // Fill and Show Modal
            document.getElementById("modalEventTitle").innerText = eventTitle;
            document.getElementById("modalEventDetails").innerText = eventLocation;
            if (eventModal) eventModal.show();
        }
    });

    // --- 4. FORM SUBMISSION ---
    const regForm = document.getElementById("eventRegistrationForm");
    if (regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const eventName = document.getElementById("modalEventTitle").innerText;
            
            const registration = {
                id: Date.now(),
                event: eventName,
                user: document.getElementById("regName").value,
                date: new Date().toLocaleDateString()
            };

            // Save to Local Storage
            const history = JSON.parse(localStorage.getItem("eventRegistrations") || "[]");
            history.push(registration);
            localStorage.setItem("eventRegistrations", JSON.stringify(history));

            // Feedback
            if (activeLink) {
                activeLink.innerHTML = 'Confirmed <i class="bi bi-check-circle-fill"></i>';
                // Apply different success styles depending on if it's a button or link
                if (activeLink.tagName === "BUTTON") {
                    activeLink.className = "btn btn-success btn-lg rounded-pill fw-bold px-5";
                } else {
                    activeLink.className = "text-success fw-bold text-decoration-none small";
                }
                activeLink.style.pointerEvents = "none";
            }

            eventModal.hide();
            regForm.reset();
            alert("Success! Your pass for " + eventName + " is ready.");
        });
    }
});