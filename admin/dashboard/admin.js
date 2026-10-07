// ================================
// GET HTML ELEMENTS
// ================================

const username = document.getElementById("username");
const adminName = document.getElementById("adminName");

const totalMembers = document.getElementById("totalMembers");
const activeMembers = document.getElementById("activeMembers");
const expiredMembers = document.getElementById("expiredMembers");
const totalTrainers = document.getElementById("totalTrainers");
const todayAttendance = document.getElementById("todayAttendance");


const notificationIcon = document.getElementById("notification-icon");
const viewAllBtn = document.getElementById("viewAllBtn");


// ================================
// GET MEMBERS FROM LOCAL STORAGE
// ================================

let members = JSON.parse(localStorage.getItem("members")) || [];
let trainers = JSON.parse(localStorage.getItem("trainers")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];


// ================================
// UPDATE MEMBER STATISTICS
// ================================

function updateMemberStats() {

    // Total members
    totalMembers.textContent = members.length;


    // Active members
    const active = members.filter(function(member) {
        return member.status === "Active";
    });

    activeMembers.textContent = active.length;


    // Expired members
    const expired = members.filter(function(member) {
        return member.status === "Expired";
    });

    expiredMembers.textContent = expired.length;
}
function updateTrainerStats() {

    totalTrainers.textContent = trainers.length;

}
function updateTodayAttendance() {

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const presentToday = attendance.filter(function(record) {

        return (
            record.date === today &&
            record.status === "Present"
        );

    });

    todayAttendance.textContent = presentToday.length;
}

// ================================
// SHOW LOGGED-IN ADMIN NAME
// ================================

const loggedInAdmin = localStorage.getItem("loggedInAdmin");

if (loggedInAdmin) {

    username.textContent = loggedInAdmin;
    adminName.textContent = loggedInAdmin;

}







// ================================
// NOTIFICATION
// ================================

notificationIcon.addEventListener("click", function() {

    alert("You have new notifications.");

});


// ================================
// VIEW ALL ACTIVITIES
// ================================

viewAllBtn.addEventListener("click", function() {

    alert("All activities will be shown here.");

});



// RUN WHEN PAGE LOADS

updateTrainerStats();
updateMemberStats();
updateTodayAttendance();