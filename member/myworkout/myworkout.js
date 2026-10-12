
/* ==========================================
   POWERFIT - MY WORKOUT PLAN
========================================== */

// ================= GET HTML ELEMENTS =================

const memberName = document.getElementById("memberName");

const workoutPlanName = document.getElementById("workoutPlanName");
const workoutGoal = document.getElementById("workoutGoal");
const totalExercises = document.getElementById("totalExercises");

const planTitle = document.getElementById("planTitle");
const planGoal = document.getElementById("planGoal");
const planDuration = document.getElementById("planDuration");
const planTrainer = document.getElementById("planTrainer");

const exerciseTableBody = document.getElementById("exerciseTableBody");
const trainerInstructions = document.getElementById("trainerInstructions");


// ================= GET LOCALSTORAGE DATA =================

const members = JSON.parse(localStorage.getItem("members")) || [];

const trainers = JSON.parse(localStorage.getItem("trainers")) || [];

const workoutPlans =
    JSON.parse(localStorage.getItem("workoutPlans")) || [];


// ================= GET LOGGED-IN MEMBER =================

let loggedInMember = null;

try {
    loggedInMember = JSON.parse(
        localStorage.getItem("loggedInMember")
    );
} catch (error) {
    console.log("Invalid member login data.");
}


// ================= FIND CURRENT MEMBER =================

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


// ================= HELPER: SAFE TEXT =================

// User-provided text ko HTML ki tarah insert nahi karna.
function createCell(value) {

    const td = document.createElement("td");

    td.textContent =
        value !== undefined && value !== null && value !== ""
            ? value
            : "--";

    return td;
}


// ================= SHOW EMPTY EXERCISES =================

function showEmptyExercises(message) {

    exerciseTableBody.replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.className = "empty-message";
    cell.textContent = message;

    row.appendChild(cell);
    exerciseTableBody.appendChild(row);

    totalExercises.textContent = "0";
}


// ================= LOAD WORKOUT PLAN =================

function loadMyWorkoutPlan() {

    // Member login nahi hai
    if (!member) {

        workoutPlanName.textContent = "Not Available";
        workoutGoal.textContent = "--";

        planTitle.textContent = "--";
        planGoal.textContent = "--";
        planDuration.textContent = "--";
        planTrainer.textContent = "--";

        trainerInstructions.textContent =
            "Please log in with your member account.";

        showEmptyExercises("Please log in to view your workout plan.");

        return;
    }


    // ================= FIND MEMBER'S PLAN =================

    // Sirf us plan ko show karna hai jo current member ko assign hai.
    const myPlan = workoutPlans.find(function (plan) {

        return (
            plan.memberId != null &&
            String(plan.memberId) === String(member.id)
        );

    });


    // Plan assign nahi hua
    if (!myPlan) {

        workoutPlanName.textContent = "Not Assigned";
        workoutGoal.textContent = member.memberGoal || "--";

        planTitle.textContent = "No Plan Assigned";
        planGoal.textContent = member.memberGoal || "--";
        planDuration.textContent = "--";
        planTrainer.textContent = "--";

        trainerInstructions.textContent =
            "Your trainer has not assigned a workout plan yet.";

        showEmptyExercises("No workout plan has been assigned to you.");

        return;
    }


    // ================= SHOW PLAN DETAILS =================

    const exercises = Array.isArray(myPlan.exercises)
        ? myPlan.exercises
        : [];

    const goal = myPlan.goal || myPlan.category || member.memberGoal || "--";

    workoutPlanName.textContent = myPlan.planName || myPlan.name || "--";

    workoutGoal.textContent = goal;

    planTitle.textContent = myPlan.planName || myPlan.name || "--";

    planGoal.textContent = goal;

    planDuration.textContent = myPlan.duration || "--";

    trainerInstructions.textContent =
        myPlan.instructions ||
        "Follow the exercises and instructions assigned by your trainer.";


    // ================= FIND ASSIGNED TRAINER =================

    const assignedTrainer = trainers.find(function (trainer) {

        return (
            myPlan.trainerId != null &&
            String(trainer.id) === String(myPlan.trainerId)
        );

    });

    planTrainer.textContent = assignedTrainer
        ? assignedTrainer.name || "--"
        : "Not Assigned";


    // ================= SHOW EXERCISES =================

    exerciseTableBody.replaceChildren();

    totalExercises.textContent = String(exercises.length);

    if (exercises.length === 0) {

        showEmptyExercises("No exercises have been added to this plan.");

        return;
    }


    exercises.forEach(function (exercise, index) {

        const row = document.createElement("tr");

        row.appendChild(createCell(index + 1));

        row.appendChild(
            createCell(exercise.name || exercise.exerciseName)
        );

        row.appendChild(createCell(exercise.sets));

        row.appendChild(createCell(exercise.reps));

        row.appendChild(
            createCell(exercise.rest || exercise.restTime)
        );

        row.appendChild(
            createCell(exercise.instructions || exercise.description)
        );

        exerciseTableBody.appendChild(row);

    });

}


// ================= RUN FUNCTION =================

loadMyWorkoutPlan();


// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function (event) {

    event.preventDefault();

    localStorage.removeItem("loggedInMember");

    window.location.href = "../../index.html";

});
