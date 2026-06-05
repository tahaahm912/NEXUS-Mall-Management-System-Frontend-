/**
 * NexusMMS - Admin Portal Logic
 * Matches HTML IDs: s1 (Name), s2 (User), s3 (Pass), s4 (Confirm)
 */

document.addEventListener("DOMContentLoaded", () => {
    // ================== UI ELEMENTS ==================
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // ================== CONSTANTS ==================
    const STORAGE_KEY = "nexus_admins";

    // ================== UI & THEME TOGGLES ==================
    // Desktop Sliding Logic
    if (registerBtn) registerBtn.addEventListener("click", () => container.classList.add("active"));
    if (loginBtn) loginBtn.addEventListener("click", () => container.classList.remove("active"));

    // Mobile Toggle Link
    window.toggleAuth = () => container.classList.toggle("active");

    // Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        if(themeIcon) themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    };

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
        });
    }

    // ================== DATABASE HELPERS ==================
    const getAdmins = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const saveAdmins = (admins) => localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));

    // ================== SIGNUP LOGIC ==================
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Extracting values based on your HTML IDs
            const fullName = document.getElementById("s1").value.trim();
            const username = document.getElementById("s2").value.trim();
            const password = document.getElementById("s3").value;
            const confirm = document.getElementById("s4").value;

            // 1. Validation
            if (!fullName || !username || !password || !confirm) {
                alert("All fields are required.");
                return;
            }

            if (password !== confirm) {
                alert("Passwords do not match!");
                return;
            }

            // 2. Storage Logic
            let admins = getAdmins();

            // Check if admin already exists
            if (admins.some(a => a.username.toLowerCase() === username.toLowerCase())) {
                alert("Username already exists. Please choose another.");
                return;
            }

            // 3. Save New Admin
            admins.push({
                fullName,
                username,
                password, // For production, use password hashing
                createdAt: new Date().toLocaleString()
            });

            saveAdmins(admins);
            alert("Admin created successfully! Switching to Login.");
            
            signupForm.reset();
            container.classList.remove("active"); // Move UI back to Sign In
        });
    }

    // ================== LOGIN LOGIC ==================
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const usernameInp = document.getElementById("l1").value.trim();
            const passwordInp = document.getElementById("l2").value;

            if (!usernameInp || !passwordInp) {
                alert("Please enter username and password.");
                return;
            }

            const admins = getAdmins();
            const matchedAdmin = admins.find(a => a.username === usernameInp && a.password === passwordInp);

            if (matchedAdmin) {
                // Save session for dashboard
                sessionStorage.setItem("currentAdmin", JSON.stringify({
                    name: matchedAdmin.fullName,
                    user: matchedAdmin.username
                }));

                alert(`Welcome, ${matchedAdmin.fullName}!`);
                
                // Redirecting to Admin Dashboard
                window.location.assign("admindash1.html"); 
            } else {
                alert("Incorrect username or password.");
            }
        });
    }

    initTheme();
});