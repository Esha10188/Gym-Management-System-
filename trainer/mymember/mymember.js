

// ===============================
// GET HTML ELEMENTS
// ===============================

const totalAssignedMembers =
    document.getElementById("totalAssignedMembers");

const activeMembers =
    document.getElementById("activeMembers");

const expiredMembers =
    document.getElementById("expiredMembers");

const todayAttendance =
    document.getElementById("todayAttendance");

const searchMember =
    document.getElementById("searchMember");

const memberTableBody =
    document.getElementById("memberTableBody");


// ===============================
// MEMBER MODAL ELEMENTS
// ===============================

const memberModal =
    document.getElementById("memberModal");

const closeModal =
    document.getElementById("closeModal");

const detailPhone =
    document.getElementById("detailPhone");

const detailEmail =
    document.getElementById("detailEmail");

const detailExpiry =
    document.getElementById("detailExpiry");

const detailAttendance =
    document.getElementById("detailAttendance");

const detailWorkout =
    document.getElementById("detailWorkout");

const detailNotes =
    document.getElementById("detailNotes");


// ===============================
// GET LOGGED-IN TRAINER
// ===============================

const loggedInTrainer =
    JSON.parse(localStorage.getItem("loggedInTrainer"));


// ===============================
// GET MEMBERS
// ===============================

const members =
    JSON.parse(localStorage.getItem("members")) || [];


// ===============================
// GET CLASSES
// ===============================

const classes =
    JSON.parse(localStorage.getItem("classes")) || [];


// ===============================
// GET MY MEMBERS
// ===============================

const mymembers = members.filter(function (member) {

    return String
      (member.trainerId) === String(loggedInTrainer.id);

});


// ===============================
// SHOW SUMMARY
// ===============================

totalAssignedMembers.textContent =
    mymembers.length;


const activeMemberList = mymembers.filter(function (member) {

    return member.status === "Active";

});


activeMembers.textContent =
    activeMemberList.length;


const expiredMemberList = mymembers.filter(function (member) {

    return member.status === "Expired";

});


expiredMembers.textContent =
    expiredMemberList.length;


// ===============================
// SHOW MEMBERS
// ===============================

function displayMembers(memberList) {

    memberTableBody.innerHTML = "";


    memberList.forEach(function (member) {


        // Find member's class

        const memberClass = classes.find(function (classItem) {

            return classItem.id === member.classId;

        });


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${String(member.id).padStart(3, "0")}</td>

            <td>${member.name}</td>

            <td>${member.cnic}</td>

            <td>${member.membership}</td>

            <td>${member.goal}</td>

            <td>${memberClass ? memberClass.name : "-"}</td>

            <td>

                <span class="status ${
                    member.status === "Active"
                        ? "active-status"
                        : "expired-status"
                }">

                    ${member.status}

                </span>

            </td>

            <td>

                <button
                    class="view-btn"
                    data-id="${member.id}"
                >
                    View Details
                </button>

            </td>

        `;


        memberTableBody.appendChild(row);

    });

}


// ===============================
// FIRST DISPLAY
// ===============================

displayMembers(mymembers);


// ===============================
// SEARCH MEMBERS
// ===============================

searchMember.addEventListener("input", function () {

    const searchValue =
        searchMember.value.toLowerCase().trim();


    const filteredMembers = mymembers.filter(function (member) {

        return (

            String(member.id)
                .toLowerCase()
                .includes(searchValue)

            ||

            member.name
                .toLowerCase()
                .includes(searchValue)

            ||

            member.cnic
                .toLowerCase()
                .includes(searchValue)

        );

    });


    displayMembers(filteredMembers);

});


// ===============================
// VIEW MEMBER DETAILS
// ===============================

memberTableBody.addEventListener("click", function (event) {

    if (event.target.classList.contains("view-btn")) {

        const memberId =
            Number(event.target.dataset.id);


        const member =
            mymembers.find(function (member) {

                return member.id === memberId;

            });


        if (!member) {
            return;
        }


        detailPhone.textContent =
            member.phone || "-";


        detailEmail.textContent =
            member.email || "-";


        detailExpiry.textContent =
            member.expiryDate || "-";


        detailAttendance.textContent =
            "Coming Soon";


        detailWorkout.textContent =
            "Coming Soon";


        detailNotes.textContent =
            "No notes";


        memberModal.classList.add("show");

    }

});


// ===============================
// CLOSE MODAL
// ===============================

closeModal.addEventListener("click", function () {

    memberModal.classList.remove("show");

});


// ===============================
// CLOSE MODAL ON OUTSIDE CLICK
// ===============================

memberModal.addEventListener("click", function (event) {

    if (event.target === memberModal) {

        memberModal.classList.remove("show");

    }

});


// ===============================
// TODAY'S ATTENDANCE
// ===============================

const attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];

const today =
    new Date().toISOString().split("T")[0];


const todayPresentMembers =
    attendance.filter(function (record) {

        return (
            record.date === today &&
            record.status === "Present" &&
            mymembers.some(function (member) {

                return member.id === record.memberId;

            })
        );

    });


todayAttendance.textContent =
    todayPresentMembers.length;
    // =============== . LOGOUT ===============

const logoutLink = document.querySelector(".Logout");

if (logoutLink) {

    logoutLink.addEventListener("click", function () {

        localStorage.removeItem("loggedInTrainer");

    });

}







