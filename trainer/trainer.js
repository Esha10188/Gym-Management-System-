// ===============================
// GET HTML ELEMENTS
// ===============================

const trainerName = document.getElementById("trainerName");
const trainerProfileName = document.getElementById("trainerProfileName");

const assignedMembers = document.getElementById("assignedMembers");
const todayClasses = document.getElementById("todayClasses");
const todayAttendance = document.getElementById("todayAttendance");
const activeWorkoutPlans = document.getElementById("activeWorkoutPlans");

const viewClassesBtn = document.getElementById("viewClassesBtn");
const viewAllBtn = document.getElementById("viewAllBtn");


// ===============================
// GET LOGGED-IN TRAINER
// ===============================

const loggedInTrainer =
    JSON.parse(localStorage.getItem("loggedInTrainer"));


// ===============================
// SHOW TRAINER NAME
// ===============================

trainerName.textContent = loggedInTrainer.name;
trainerProfileName.textContent = loggedInTrainer.name;


// ===============================
// GET MEMBERS AND CLASSES
// ===============================

const members =
    JSON.parse(localStorage.getItem("members")) || [];

const classes =
    JSON.parse(localStorage.getItem("classes")) || [];


// ===============================
// GET TRAINER'S CLASSES
// ===============================

const myClasses = classes.filter(function(classItem) {

    return classItem.trainerId === loggedInTrainer.id;

});


// ===============================
// GET ASSIGNED MEMBERS
// ===============================

const myMembers = members.filter(function(member) {

    return member.trainerId === loggedInTrainer.id;

});


// ===============================
// SHOW ASSIGNED MEMBERS
// ===============================

assignedMembers.textContent = myMembers.length;


// ===============================
// DEBUG
// ===============================

console.log("Logged Trainer:", loggedInTrainer);
console.log("All Classes:", classes);
console.log("My Classes:", myClasses);
console.log("All Members:", members);
console.log("My Members:", myMembers);
JSON.parse(localStorage.getItem("members"))
JSON.parse(localStorage.getItem("classes"))