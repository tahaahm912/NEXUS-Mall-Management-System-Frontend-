document.addEventListener("DOMContentLoaded", () => {
    // Selectors
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    const STORAGE_KEY = "nexus_owner";

    // --- UI Logic ---
    if (registerBtn) registerBtn.addEventListener("click", () => container.classList.add("active"));
    if (loginBtn) loginBtn.addEventListener("click", () => container.classList.remove("active"));

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if(themeIcon) themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        if(themeIcon) themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    });

    // --- Helpers ---
    const getOwner = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const saveOwner = (owner) => localStorage.setItem(STORAGE_KEY, JSON.stringify(owner));

    // --- SIGNUP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fullName = document.getElementById("s1").value.trim();
            const username = document.getElementById("s3").value.trim();
            const password = document.getElementById("s4").value;
            const confirm = document.getElementById("s5").value;

            if (!fullName || !username || !password) {
                alert("Please fill in all fields.");
                return;
            }
            if (password !== confirm) {
                alert("Passwords do not match!");
                return;
            }

            let owner = getOwner();
            if (owner.some(a => a.username.toLowerCase() === username.toLowerCase())) {
                alert("Username already exists!");
                return;
            }

            owner.push({
                fullName,
                username,
                password,
                lastActive: new Date().toLocaleString()
            });

            saveOwner(owner);
            alert("Business Registered Successfully! Please Sign In.");
            signupForm.reset();
            container.classList.remove("active"); 
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // IMPORTANT: Prevents form from reloading the current page
            
            const username = document.getElementById("l1").value.trim();
            const password = document.getElementById("l2").value;

            if (!username || !password) {
                alert("Please enter credentials.");
                return;
            }

            let owners = getOwner();
            const user = owners.find(a => a.username === username && a.password === password);

            if (!user) {
                alert("Invalid username or password");
                return;
            }

            // 1. Update activity data
            user.lastActive = new Date().toLocaleString();
            saveOwner(owners);
            
            // 2. Set Session Storage
            sessionStorage.setItem("currentOwner", JSON.stringify(user));
            
            console.log("Login Success. Redirecting...");

            // 3. Redirect with a slight delay to ensure storage is committed
            setTimeout(() => {
                window.location.assign("ownerdash1.html"); 
            }, 500);
        });
    }
});