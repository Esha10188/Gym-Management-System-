console.log("My Attendance JS is working!");
/* =========================================
   POWERFIT - TRAINER ATTENDANCE
   Trainer sirf apne members ki attendance dekhega
========================================= */


// ================= HTML ELEMENTS =================

const attendanceDate = document.getElementById("attendanceDate");
const searchMember = document.getElementById("searchMember");
const statusFilter = document.getElementById("statusFilter");
const attendanceTableBody = document.getElementById("attendanceTableBody");


// ================= MODAL ELEMENTS =================

const attendanceModal = document.getElementById("attendanceModal");
const closeModal = document.getElementById("closeModal");


// ================= LOGIN TRAINER =================

// Login ke waqt saved trainer ka data lena
let loggedInTrainer = null;

try {
    loggedInTrainer = JSON.parse(
        localStorage.getItem("loggedInTrainer")
    );
} catch (error) {
    loggedInTrainer = null;
}


// Trainer login nahi hai to login page par bhejo
if (!loggedInTrainer || loggedInTrainer.id == null) {

    window.location.href = "../../index.html";

} else {

    document.getElementById("trainerProfileName").textContent =
        loggedInTrainer.name || "Trainer";

}


// ================= LOCAL STORAGE DATA =================

let members =
    JSON.parse(localStorage.getItem("members")) || [];

let classes =
    JSON.parse(localStorage.getItem("classes")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];


// ================= TODAY'S DATE =================

// Local date use karna, taake date timezone ki wajah se
// ek din pehle ya baad ki na ho.
function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Date input mein aaj ki date set karo
attendanceDate.value = getTodayDate();


// ================= TRAINER KI CLASSES =================

function getMyClasses() {

    return classes.filter(function (classItem) {

        return (
            String(classItem.trainerId) ===
            String(loggedInTrainer.id)
        );

    });

}


// ================= TRAINER KE MEMBERS =================

function getMyMembers() {

    // Pehle logged-in trainer ki classes lo
    const myClasses = getMyClasses();


    // Sirf un members ko lo jo trainer ki classes mein hain
    const myMembers = members.filter(function (member) {

        const assignedClass = myClasses.find(function (classItem) {

            return (
                String(classItem.id) ===
                String(member.classId)
            );

        });


        // Filhal sirf Active members ki attendance dikhani hai
        return (
            assignedClass &&
            member.status === "Active"
        );

    });


    return myMembers;

}


// ================= MEMBER KI CLASS =================

function getMemberClass(member) {

    const myClasses = getMyClasses();

    return myClasses.find(function (classItem) {

        return (
            String(classItem.id) ===
            String(member.classId)
        );

    });

}


// ================= ATTENDANCE RECORD =================

// Kisi member ki selected date ka record dhoondo
function getAttendanceRecord(memberId, date) {

    return attendance.find(function (record) {

        return (
            String(record.memberId) === String(memberId) &&
            record.date === date
        );

    });

}


// ================= DISPLAY ATTENDANCE =================

function displayAttendance() {

    attendanceTableBody.innerHTML = "";


    // Trainer ke assigned active members
    const myMembers = getMyMembers();


    // Search aur filters ki values
    const searchValue =
        searchMember.value.toLowerCase().trim();

    const selectedDate = attendanceDate.value;

    const selectedStatus = statusFilter.value;


    // Har assigned member ki attendance check karo
    myMembers.forEach(function (member) {

        const record = getAttendanceRecord(
            member.id,
            selectedDate
        );


        // Agar record nahi hai to member Absent hoga
        let status = "Absent";

        let checkIn = "-";


        if (record) {

            status = record.status;

            checkIn = record.checkIn || "-";

        }


        // Member ki class find karo
        const assignedClass = getMemberClass(member);

        const className = assignedClass
            ? assignedClass.name
            : "Class not found";


        // Search by member name ya ID
        const matchesSearch =
            String(member.name || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(member.id)
                .toLowerCase()
                .includes(searchValue);


        // Status filter
        const matchesStatus =
            selectedStatus === "all" ||
            selectedStatus.toLowerCase() ===
            status.toLowerCase();


        // Agar search ya status match na kare to skip karo
        if (!matchesSearch || !matchesStatus) {
            return;
        }


        // Table row create karo
        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${String(member.id).padStart(3, "0")}
            </td>

            <td>
                ${member.name}
            </td>

            <td>
                ${className}
            </td>

            <td>
                ${selectedDate}
            </td>

            <td>
                ${checkIn}
            </td>

            <td>
                <span class="status-${status.toLowerCase()}">
                    ${status}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="view-details-btn"
                    data-member-id="${member.id}"
                    data-date="${selectedDate}">

                    <i class="fa-solid fa-eye"></i>
                    View Details

                </button>
            </td>

        `;


        attendanceTableBody.appendChild(row);

    });


    // Cards ko selected date ke mutabiq update karo
    updateSummary(selectedDate);

}


// ================= SUMMARY CARDS =================

function updateSummary(selectedDate) {

    const myMembers = getMyMembers();


    let presentCount = 0;

    let absentCount = 0;


    myMembers.forEach(function (member) {

        const record = getAttendanceRecord(
            member.id,
            selectedDate
        );


        if (record && record.status === "Present") {

            presentCount++;

        } else {

            absentCount++;

        }

    });


    const totalMembers = myMembers.length;


    // Attendance percentage calculate karo
    let attendanceRate = 0;

    if (totalMembers > 0) {

        attendanceRate = Math.round(
            (presentCount / totalMembers) * 100
        );

    }


    document.getElementById("totalMembers").textContent =
        totalMembers;

    document.getElementById("presentToday").textContent =
        presentCount;

    document.getElementById("absentToday").textContent =
        absentCount;

    document.getElementById("attendanceRate").textContent =
        attendanceRate + "%";

}


// ================= VIEW DETAILS MODAL =================

// Table ke View Details buttons par click handle karo
attendanceTableBody.addEventListener("click", function (event) {

    const button = event.target.closest(".view-details-btn");


    if (!button) {
        return;
    }


    const memberId = button.dataset.memberId;

    const selectedDate = button.dataset.date;


    // Sirf trainer ke assigned member ko allow karo
    const member = getMyMembers().find(function (item) {

        return String(item.id) === String(memberId);

    });


    if (!member) {
        return;
    }


    const record = getAttendanceRecord(
        member.id,
        selectedDate
    );


    const assignedClass = getMemberClass(member);


    const status = record
        ? record.status
        : "Absent";


    // Modal mein details show karo
    document.getElementById("detailMemberId").textContent =
        String(member.id).padStart(3, "0");

    document.getElementById("detailMemberName").textContent =
        member.name;

    document.getElementById("detailClass").textContent =
        assignedClass ? assignedClass.name : "Class not found";

    document.getElementById("detailDate").textContent =
        selectedDate;

    document.getElementById("detailCheckIn").textContent =
        record ? (record.checkIn || "-") : "-";

    document.getElementById("detailStatus").textContent =
        status;


    attendanceModal.style.display = "flex";

});


// ================= CLOSE MODAL =================

closeModal.addEventListener("click", function () {

    attendanceModal.style.display = "none";

});


// Modal ke bahar click karne se close ho
attendanceModal.addEventListener("click", function (event) {

    if (event.target === attendanceModal) {

        attendanceModal.style.display = "none";

    }

});


// ================= SEARCH =================

searchMember.addEventListener("input", function () {

    displayAttendance();

});


// ================= STATUS FILTER =================

statusFilter.addEventListener("change", function () {

    displayAttendance();

});


// ================= DATE FILTER =================

attendanceDate.addEventListener("change", function () {

    displayAttendance();

});



 // ================= TRAINER LOGIN CHECK =================

function checkTrainerLogin() {

    const loggedInTrainer =
        JSON.parse(localStorage.getItem("loggedInTrainer"));

    if (!loggedInTrainer) {
        window.location.replace("../../index.html");
    }
}

// ================= TRAINER LOGOUT =================

const logoutBtn = document.querySelector(".Logout");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        // Logged-in trainer ka session remove karo
        localStorage.removeItem("loggedInTrainer");

        // Login page par bhejo
        window.location.replace("../../index.html");

    });

}

// Page load par trainer login check karo
checkTrainerLogin();




// ================= INITIAL LOAD =================

if (loggedInTrainer && loggedInTrainer.id != null) {

    displayAttendance();

}
