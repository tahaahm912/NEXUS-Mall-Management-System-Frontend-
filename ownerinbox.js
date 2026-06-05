/**
 * NexusMMS Inbox Management System
 * Features: Dark Mode Sync, LocalStorage Persistence, Search, Real-time Filtering
 */

// --- THEME SYNC (Runs immediately to prevent flashing) ---
const syncTheme = () => {
  const savedTheme = localStorage.getItem("nexus-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
};
syncTheme(); // Execute immediately

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM Elements ---
  const themeBtn = document.getElementById("dark-mode-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const chatInput = document.querySelector(".chat-input-area input");
  const sendBtn = document.querySelector(".chat-input-area .btn-primary");
  const chatContainer = document.querySelector(".chat-bubbles");
  const contactItems = document.querySelectorAll(".message-item");
  const chatHeaderName = document.querySelector(".view-header h6");
  const chatHeaderAvatar = document.querySelector(".avatar-circle");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const searchInput = document.querySelector(".inbox-list-header input");

  // Default state
  let currentChatUser = "George Bennett";

  // --- 2. THEME LOGIC ---
  const updateThemeUI = (theme) => {
    if (theme === "dark") {
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    } else {
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nexus-theme", theme);
    updateThemeUI(theme);
  };

  themeBtn.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    applyTheme(activeTheme === "dark" ? "light" : "dark" );
  });

  // Initialize UI on load
  updateThemeUI(localStorage.getItem("nexus-theme") || "light");

  // Listen for changes in OTHER tabs (Syncing across dashboard/inventory)
  window.addEventListener("storage", (event) => {
    if (event.key === "nexus-theme") {
      applyTheme(event.newValue);
    }
  });

  // --- 3. SEARCH LOGIC ---
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      contactItems.forEach((item) => {
        const userName = item.querySelector("h6").innerText.toLowerCase();
        const msgPreview = item.querySelector("p").innerText.toLowerCase();
        
        if (userName.includes(searchTerm) || msgPreview.includes(searchTerm)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // --- 4. INBOX & STORAGE LOGIC ---
  const renderBubble = (text, type, time = "Just now") => {
    const bubble = document.createElement("div");
    bubble.className = `bubble bubble-${type}`;
    bubble.innerHTML = `
            <div>${text}</div>
            <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${time}</div>
        `;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const loadConversation = (username) => {
    currentChatUser = username;
    chatContainer.innerHTML = "";
    
    // Check Local Storage for history
    const storageKey = `chat_history_${username.replace(/\s+/g, '_')}`;
    const history = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (history.length === 0) {
      renderBubble(
        `This is the start of your secure conversation with ${username}.`,
        "received",
        "System"
      );
    } else {
      history.forEach((msg) => renderBubble(msg.text, msg.type, msg.time));
    }

    chatHeaderName.innerText = username;
    chatHeaderAvatar.innerText = username.charAt(0);
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 992 && sidebarToggle) {
        sidebarToggle.checked = false;
    }
  };

  const saveMessage = (username, text, type) => {
    const storageKey = `chat_history_${username.replace(/\s+/g, '_')}`;
    const history = JSON.parse(localStorage.getItem(storageKey)) || [];
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    history.push({ text, type, time: timestamp });
    localStorage.setItem(storageKey, JSON.stringify(history));
    return timestamp;
  };

  const handleSendMessage = () => {
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // Save and render sent message
    const time = saveMessage(currentChatUser, messageText, "sent");
    renderBubble(messageText, "sent", time);
    chatInput.value = "";

    // Simulated Auto-Response
    setTimeout(() => {
      const responseText = `Message received. We will get back to you shortly.`;
      const responseTime = saveMessage(currentChatUser, responseText, "received");
      renderBubble(responseText, "received", responseTime);
    }, 1200);
  };

  // --- 5. EVENT LISTENERS ---
  if (sendBtn) {
    sendBtn.addEventListener("click", handleSendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
  }

  contactItems.forEach((item) => {
    item.addEventListener("click", function () {
      contactItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      
      const name = this.querySelector("h6").innerText;
      loadConversation(name);
      
      const dot = this.querySelector(".unread-dot");
      if (dot) dot.style.display = "none";
    });
  });

  // Initial Render
  loadConversation("George Bennett");
});