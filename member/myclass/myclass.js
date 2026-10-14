
/* =========================================
   POWERFIT - MY CLASS & TRAINER
========================================= */

// ================= GET HTML ELEMENTS =================

const memberName = document.getElementById("memberName");

const className = document.getElementById("className");
const classCategory = document.getElementById("classCategory");
const trainerName = document.getElementById("trainerName");

const classDay = document.getElementById("classDay");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");
const classLocation = document.getElementById("classLocation");
const classCapacity = document.getElementById("classCapacity");
const classStatus = document.getElementById("classStatus");

const trainerFullName = document.getElementById("trainerFullName");
const trainerSpecialization = document.getElementById("trainerSpecialization");
const trainerEmail = document.getElementById("trainerEmail");
const trainerPhone = document.getElementById("trainerPhone");


// ================= GET LOCALSTORAGE DATA =================

const members = JSON.parse(localStorage.getItem("members")) || [];

const classes = JSON.parse(localStorage.getItem("classes")) || [];

const trainers = JSON.parse(localStorage.getItem("trainers")) || [];


// ================= GET LOGGED-IN MEMBER =================

let loggedInMember = null;

try {
    loggedInMember = JSON.parse(
        localStorage.getItem("loggedInMember")
    );
} catch (error) {
    console.log("Member login data is invalid.");
}


// ================= FIND MEMBER =================

let member = null;

if (loggedInMember) {

    if (typeof loggedInMember === "object") {

        member = members.find(function (item) {

            return (
                (loggedInMember.id != null &&
                    String(item.id) === String(loggedInMember.id)) ||

                (loggedInMember.memberId != null &&
                    String(item.id) === String(loggedInMember.memberId)) ||

                (loggedInMember.email &&
                    item.email === loggedInMember.email)
            );

        });

    } else {

        member = members.find(function (item) {

            return (
                String(item.id) === String(loggedInMember) ||
                item.email === loggedInMember
            );

        });

    }
}


// ================= SHOW MEMBER NAME =================

if (member) {

    memberName.textContent = member.name || "Member";

} else {

    memberName.textContent = "Member Not Found";

}


// ================= FIND ASSIGNED CLASS =================

function loadMyClass() {

    if (!member) {

        className.textContent = "Member Not Found";
        classCategory.textContent = "--";
        trainerName.textContent = "--";

        classDay.textContent = "--";
        startTime.textContent = "--";
        endTime.textContent = "--";
        classLocation.textContent = "--";
        classCapacity.textContent = "--";
        classStatus.textContent = "--";

        trainerFullName.textContent = "--";
        trainerSpecialization.textContent = "--";
        trainerEmail.textContent = "--";
        trainerPhone.textContent = "--";

        return;
    }

    // Member ki saved class ID hasil karo
    const assignedClassId = member.classId;

    // Classes mein matching class dhoondo
    const assignedClass = classes.find(function (item) {

        return (
            assignedClassId != null &&
            String(item.id) === String(assignedClassId)
        );

    });


    // Agar class assign nahi hai
    if (!assignedClass) {

        className.textContent = "Not Assigned";
        classCategory.textContent = member.memberGoal || "--";
        trainerName.textContent = "Not Assigned";

        classDay.textContent = "--";
        startTime.textContent = "--";
        endTime.textContent = "--";
        classLocation.textContent = "--";
        classCapacity.textContent = "--";
        classStatus.textContent = "--";

        trainerFullName.textContent = "No Trainer Assigned";
        trainerSpecialization.textContent = "--";
        trainerEmail.textContent = "--";
        trainerPhone.textContent = "--";

        return;
    }


    // ================= SHOW CLASS DETAILS =================

    className.textContent = assignedClass.name || "--";

    classCategory.textContent =
        assignedClass.category || member.memberGoal || "--";

    classDay.textContent = assignedClass.day || "--";

    startTime.textContent = assignedClass.startTime || "--";

    endTime.textContent = assignedClass.endTime || "--";

    classLocation.textContent = assignedClass.location || "--";

    classCapacity.textContent = assignedClass.capacity ?? "--";

    classStatus.textContent = assignedClass.status || "--";


    // ================= FIND ASSIGNED TRAINER =================

    const assignedTrainer = trainers.find(function (item) {

        return (
            assignedClass.trainerId != null &&
            String(item.id) === String(assignedClass.trainerId)
        );

    });


    // Agar trainer nahi milta
    if (!assignedTrainer) {

        trainerName.textContent = "Not Assigned";

        trainerFullName.textContent = "No Trainer Assigned";
        trainerSpecialization.textContent = "--";
        trainerEmail.textContent = "--";
        trainerPhone.textContent = "--";

        return;
    }


    // ================= SHOW TRAINER DETAILS =================

    trainerName.textContent = assignedTrainer.name || "--";

    trainerFullName.textContent = assignedTrainer.name || "--";

    trainerSpecialization.textContent =
        assignedTrainer.specialization || "--";

    trainerEmail.textContent = assignedTrainer.email || "--";

    trainerPhone.textContent = assignedTrainer.phone || "--";

}


// ================= RUN FUNCTION =================

loadMyClass();


// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function (event) {

    event.preventDefault();

    localStorage.removeItem("loggedInMember");

    window.location.href = "../../index.html";

});
