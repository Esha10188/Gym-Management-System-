
// ================= LOAD LOCAL STORAGE DATA =================

function getStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

const members = getStorageData("members");
const trainers = getStorageData("trainers");
const attendance = getStorageData("attendance");
const payments = getStorageData("payments");
const activities = getStorageData("activities");


// ================= ADMIN NAME =================

const loggedInAdmin = localStorage.getItem("loggedInAdmin");

const username = document.getElementById("username");
const adminName = document.getElementById("adminName");

if (loggedInAdmin) {
    username.textContent = loggedInAdmin;
    adminName.textContent = loggedInAdmin;
}


// ================= TODAY'S DATE =================

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ================= DASHBOARD CARDS =================

function loadDashboardStats() {

    // Total members
    document.getElementById("totalMembers").textContent =
        members.length;

    // Active members
    const activeMembers = members.filter(member =>
        String(member.status).toLowerCase() === "active"
    );

    document.getElementById("activeMembers").textContent =
        activeMembers.length;

    // Expired members
    const expiredMembers = members.filter(member =>
        String(member.status).toLowerCase() === "expired"
    );

    document.getElementById("expiredMembers").textContent =
        expiredMembers.length;

    // Total trainers
    document.getElementById("totalTrainers").textContent =
        trainers.length;

    // Today's attendance
    const todayAttendance = attendance.filter(record =>
        record.date === getTodayDate() &&
        String(record.status).toLowerCase() === "present"
    );

    document.getElementById("todayAttendance").textContent =
        todayAttendance.length;

    // Pending payments
    const pendingPayments = members.filter(member => {

        const hasPaid = payments.some(payment =>
            String(payment.memberId) === String(member.id) &&
            String(payment.status).toLowerCase() === "paid"
        );

        return !hasPaid;
    });

    document.getElementById("pendingPayments").textContent =
        pendingPayments.length;
}


// ================= RECENT ACTIVITIES =================

function displayRecentActivities() {

    const activityList = document.getElementById("recentActivities");

    activityList.innerHTML = "";

    if (activities.length === 0) {

        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fa-solid fa-circle-info"></i>

                <div>
                    <p>No activities available yet.</p>
                    <small>Activities will appear here when actions are recorded.</small>
                </div>
            </div>
        `;

        return;
    }

    // Latest activities first
    activities.slice(0, 5).forEach(activity => {

        const activityItem = document.createElement("div");
        activityItem.className = "activity-item";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-clock";

        const details = document.createElement("div");

        const message = document.createElement("p");
        message.textContent = activity.message || "Activity recorded";

        const date = document.createElement("small");
        date.textContent = activity.date || "";

        details.appendChild(message);
        details.appendChild(date);

        activityItem.appendChild(icon);
        activityItem.appendChild(details);

        activityList.appendChild(activityItem);
    });
}


// ================= VIEW ALL ACTIVITIES =================

const viewAllBtn = document.getElementById("viewAllBtn");

viewAllBtn.addEventListener("click", function () {

    if (activities.length === 0) {
        alert("No activities available yet.");
        return;
    }

    alert(
        activities.map(activity =>
            `${activity.message || "Activity"} - ${activity.date || ""}`
        ).join("\n")
    );
});


// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function (event) {

    event.preventDefault();

    localStorage.removeItem("loggedInAdmin");

    window.location.href = "../../index.html";
});


// ================= RUN FUNCTIONS =================

loadDashboardStats();
displayRecentActivities();
