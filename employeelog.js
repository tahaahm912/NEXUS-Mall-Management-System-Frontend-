document.addEventListener("DOMContentLoaded", () => {
    // ================== ELEMENTS ==================
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    // ================== CONSTANTS ==================
    const STORAGE_KEY = "nexus_employees";

    // ================== UI TOGGLES ==================
    if (registerBtn) registerBtn.onclick = () => container.classList.add("active");
    if (loginBtn) loginBtn.onclick = () => container.classList.remove("active");

    // Mobile Toggle for span elements
    window.toggleAuth = () => container.classList.toggle("active");

    // ================== THEME LOGIC ==================
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if(themeIcon) themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
        });
    }

    // ================== HELPERS ==================
    const getEmployees = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const saveEmployees = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // ================== SIGNUP LOGIC ==================
    window.signup = (event) => {
        event.preventDefault();

        // Using your HTML IDs: s2, s3, s4, s5
        const fullName = document.getElementById("s2").value.trim();
        const username = document.getElementById("s3").value.trim();
        const password = document.getElementById("s4").value;
        const confirm = document.getElementById("s5").value;

        if (!fullName || !username || !password) {
            alert("⚠️ Please complete all onboarding fields.");
            return;
        }

        if (password !== confirm) {
            alert("❌ Passwords do not match!");
            return;
        }

        let employees = getEmployees();

        if (employees.some(emp => emp.username.toLowerCase() === username.toLowerCase())) {
            alert("🚫 This username is already registered to a staff member.");
            return;
        }

        // Add new employee
        employees.push({
            fullName,
            username,
            password,
            role: "staff",
            onboardedDate: new Date().toLocaleString()
        });

        saveEmployees(employees);
        alert("✅ Onboarding Complete! You can now sign in to your workspace.");
        
        event.target.reset();
        container.classList.remove("active");
    };

    // ================== LOGIN LOGIC ==================
    window.login = (event) => {
        event.preventDefault();

        const userInp = document.getElementById("l1").value.trim();
        const passInp = document.getElementById("l2").value;

        if (!userInp || !passInp) {
            alert("⚠️ Please enter your staff credentials.");
            return;
        }

        const employees = getEmployees();
        const staff = employees.find(emp => emp.username === userInp && emp.password === passInp);

        if (staff) {
            // Save session
            sessionStorage.setItem("currentEmployee", JSON.stringify({
                name: staff.fullName,
                user: staff.username,
                role: staff.role
            }));

            alert(`💼 Welcome to your shift, ${staff.fullName}!`);
            
            // Redirect to employee dashboard
            window.location.href = "empdash1.html"; 
        } else {
            alert("❌ Invalid employee username or password.");
        }
    };
});