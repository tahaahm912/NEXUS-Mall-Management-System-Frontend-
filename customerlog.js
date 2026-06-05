document.addEventListener("DOMContentLoaded", () => {
    // ================== ELEMENTS ==================
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    // ================== CONSTANTS ==================
    const STORAGE_KEY = "nexus_customers";

    // ================== UI TOGGLES ==================
    if (registerBtn) registerBtn.onclick = () => container.classList.add("active");
    if (loginBtn) loginBtn.onclick = () => container.classList.remove("active");

    // Mobile Toggle for the <span> elements
    window.toggleAuth = () => container.classList.toggle("active");

    // ================== THEME LOGIC ==================
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if(themeIcon) themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    });

    // ================== DATABASE HELPERS ==================
    const getCustomers = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const saveCustomers = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // ================== SIGNUP LOGIC ==================
    window.signup = (event) => {
        event.preventDefault(); // Prevents page reload

        const fullName = document.getElementById("s1").value.trim();
        const username = document.getElementById("s2").value.trim();
        const password = document.getElementById("s3").value;
        const confirm = document.getElementById("s4").value;

        if (!fullName || !username || !password) {
            alert("Please fill in all shopping profile fields.");
            return;
        }

        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        let customers = getCustomers();

        if (customers.some(c => c.username.toLowerCase() === username.toLowerCase())) {
            alert("This username is already part of the club!");
            return;
        }

        // Add new customer
        customers.push({
            fullName,
            username,
            password,
            points: 0, // Customer-specific data
            joinedDate: new Date().toLocaleDateString()
        });

        saveCustomers(customers);
        alert("Welcome to the Club! You can now sign in.");
        
        event.target.reset();
        container.classList.remove("active");
    };

    // ================== LOGIN LOGIC ==================
    window.login = (event) => {
        event.preventDefault();

        const userInp = document.getElementById("l1").value.trim();
        const passInp = document.getElementById("l2").value;

        if (!userInp || !passInp) {
            alert("Please enter your member credentials.");
            return;
        }

        const customers = getCustomers();
        const member = customers.find(c => c.username === userInp && c.password === passInp);

        if (member) {
            // Save member session
            sessionStorage.setItem("currentCustomer", JSON.stringify(member));
            
            alert(`Happy Shopping, ${member.fullName}!`);
            
            // Redirect to customer dashboard or home
            window.location.href = "customerdash1.html"; 
        } else {
            alert("Member record not found or incorrect password.");
        }
    };
});