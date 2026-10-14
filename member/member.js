
 // ================= GET LOGGED-IN MEMBER =================

const loggedInMember = JSON.parse(
    localStorage.getItem("loggedInMember")
);

// ================= CHECK LOGIN =================

if (!loggedInMember) {

    alert("Please login first.");

    window.location.href = "../index.html";

} else {

    // ================= GET HTML ELEMENTS =================

    const username = document.getElementById("username");
    const memberName = document.getElementById("memberName");

    const membershipStatus = document.getElementById("membershipStatus");
    const expiryDate = document.getElementById("expiryDate");
    const myClass = document.getElementById("myClass");
    const attendanceCount = document.getElementById("attendanceCount");
    const workoutPlanStatus = document.getElementById("workoutPlanStatus");

    const recentAttendanceList =
        document.getElementById("recentAttendanceList");

    const logoutBtn = document.getElementById("logoutBtn");


    // ================= DISPLAY MEMBER NAME =================

    if (username) {
        username.textContent = loggedInMember.name;
    }

    if (memberName) {
        memberName.textContent = loggedInMember.name;
    }


    // ================= MEMBERSHIP STATUS =================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(loggedInMember.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    let status = "Active";

    if (
        !loggedInMember.expiryDate ||
        Number.isNaN(expiry.getTime()) ||
        expiry < today
    ) {
        status = "Expired";
    }

    if (membershipStatus) {
        membershipStatus.textContent = status;

        membershipStatus.style.color =
            status === "Active" ? "#16803D" : "#D93025";
    }


    // ================= MEMBERSHIP EXPIRY DATE =================

    if (expiryDate) {
        expiryDate.textContent =
            loggedInMember.expiryDate || "Not available";
    }


    // ================= GET ASSIGNED CLASS =================

    const classes =
        JSON.parse(localStorage.getItem("classes")) || [];

    const assignedClass = classes.find(function (classItem) {
        return String(classItem.id) ===
            String(loggedInMember.classId);
    });

    if (myClass) {
        myClass.textContent = assignedClass
            ? assignedClass.name
            : "Not Assigned";
    }


    // ================= GET MEMBER ATTENDANCE =================

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    const myAttendance = attendance.filter(function (record) {
        return String(record.memberId) ===
            String(loggedInMember.id);
    });

    if (attendanceCount) {
        attendanceCount.textContent = myAttendance.length;
    }
// ================= MY TRAINER CARD =================




const myTrainerCard = document.getElementById("myTrainer");

if (loggedInMember && loggedInMember.trainerId) {

    const trainer = trainers.find(function (t) {
        return String(t.id) === String(loggedInMember.trainerId);
    });

    if (trainer) {
        myTrainerCard.textContent = trainer.name;
    } else {
        myTrainerCard.textContent = "Not Assigned";
    }

} else {
    myTrainerCard.textContent = "Not Assigned";
}




    // ================= LOGOUT =================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (event) {

            event.preventDefault();

            localStorage.removeItem("loggedInMember");

            window.location.href = "../index.html";
        });
    }

}
