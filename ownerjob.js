// --- INITIALIZATION ---
const jobForm = document.getElementById("jobForm");

// Default data if storage is empty
let jobs = JSON.parse(localStorage.getItem("nexus_jobs")) || [
  {
    id: 1,
    title: "Inventory Manager",
    dept: "Operations",
    salary: "$3000 - $3500",
    status: "active",
    applicants: 12,
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Delivery Driver",
    dept: "Logistics",
    salary: "$2000 - $2500",
    status: "pending",
    applicants: 4,
    date: "5 days ago",
  },
];

// --- CORE FUNCTIONS ---

const saveAndRender = () => {
  localStorage.setItem("nexus_jobs", JSON.stringify(jobs));
  renderJobs();
};

const renderJobs = () => {
  const container = document.querySelector(".col-xl-8 .card");
  const header = `<div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold mb-0">Active Vacancies & Requests</h5>
                            <button class="btn btn-light btn-sm fw-bold" onclick="clearAllJobs()">Clear All</button>
                        </div>`;

  const jobHtml = jobs
    .map(
      (job) => `
            <div class="job-card ${
              job.status === "closed" ? "opacity-75" : ""
            }">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <div class="d-flex align-items-center gap-3">
                            <div class="status-badge status-${job.status}">${
        job.status
      }</div>
                            <h6 class="fw-bold mb-0">${job.title}</h6>
                        </div>
                        <p class="text-muted small mt-2 mb-0">${job.dept} • ${
        job.salary
      } • ${job.date}</p>
                    </div>
                    <div class="col-md-5 text-md-end mt-3 mt-md-0">
                        <button class="btn btn-outline-primary btn-sm rounded-pill px-3 me-2 fw-bold" onclick="showMsg('Viewing applications for ${
                          job.title
                        }')">Applications (${job.applicants})</button>
                        <button class="btn btn-danger btn-sm rounded-pill px-3 fw-bold" onclick="deleteJob(${
                          job.id
                        })"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        `
    )
    .join("");

  container.innerHTML =
    header +
    (jobs.length
      ? jobHtml
      : '<p class="text-center text-muted py-5">No active vacancies found.</p>');
};

// --- BUTTON ACTIONS ---

// Post Job
document.querySelector(".btn-post").onclick = () => {
  const title = jobForm.querySelector('input[type="text"]').value;
  const dept = jobForm.querySelector("select").value;
  const salary = jobForm.querySelectorAll("input")[1].value;
  const desc = jobForm.querySelector("textarea").value;

  if (!title || !salary) {
    showMsg("Please fill in the Job Title and Salary Range.", "error");
    return;
  }

  const newJob = {
    id: Date.now(),
    title,
    dept,
    salary,
    status: "active",
    applicants: 0,
    date: "Just now",
  };

  jobs.unshift(newJob);
  saveAndRender();
  jobForm.reset();
  showMsg("Job Vacancy Published Successfully!");
};

window.deleteJob = (id) => {
  if (confirm("Are you sure you want to remove this vacancy?")) {
    jobs = jobs.filter((j) => j.id !== id);
    saveAndRender();
  }
};

window.clearAllJobs = () => {
  if (confirm("This will delete all job listings. Proceed?")) {
    jobs = [];
    saveAndRender();
  }
};

// --- CUSTOM ALERT STYLING ---
window.showMsg = (text, type = "success") => {
  const alertBox = document.createElement("div");
  alertBox.className = `custom-alert ${type}`;
  alertBox.innerHTML = `<i class="bi ${
    type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
  } me-2"></i> ${text}`;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.classList.add("show"), 100);
  setTimeout(() => {
    alertBox.classList.remove("show");
    setTimeout(() => alertBox.remove(), 500);
  }, 3000);
};

// --- 8. DARK MODE LOGIC ---
const themeBtn = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
updateIcon(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });
}

function updateIcon(theme) {
  if (!themeIcon) return;
  if (theme === "dark") {
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    themeIcon.style.color = "#ffcc00";
  } else {
    themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    themeIcon.style.color = "";
  }
}