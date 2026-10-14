
/* =========================================
   POWERFIT - TRAINER WORKOUT PLANS
========================================= */

// =============== 1. GET HTML ELEMENTS ===============

const trainerProfileName = document.getElementById("trainerProfileName");

const totalPlans = document.getElementById("totalPlans");
const activePlans = document.getElementById("activePlans");
const completedPlans = document.getElementById("completedPlans");
const myMembers = document.getElementById("myMembers");

const createPlanBtn = document.getElementById("createPlanBtn");
const planModal = document.getElementById("planModal");
const detailsModal = document.getElementById("detailsModal");

const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const closeDetailsModal = document.getElementById("closeDetailsModal");

const workoutPlanForm = document.getElementById("workoutPlanForm");

const planMember = document.getElementById("planMember");
const planGoal = document.getElementById("planGoal");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const workoutSchedule = document.getElementById("workoutSchedule");
const exercises = document.getElementById("exercises");
const planStatus = document.getElementById("planStatus");

const searchPlan = document.getElementById("searchPlan");
const goalFilter = document.getElementById("goalFilter");
const statusFilter = document.getElementById("statusFilter");

const workoutPlansTableBody =
    document.getElementById("workoutPlansTableBody");


// =============== 2. GET LOCAL STORAGE DATA ===============

let loggedInTrainer =
    JSON.parse(localStorage.getItem("loggedInTrainer"));

let members =
    JSON.parse(localStorage.getItem("members")) || [];

let classes =
    JSON.parse(localStorage.getItem("classes")) || [];

let workoutPlans =
    JSON.parse(localStorage.getItem("workoutPlans")) || [];

let editPlanId = null;


// =============== 3. CHECK TRAINER LOGIN ===============

if (!loggedInTrainer) {

    alert("Please login as a trainer first.");

    window.location.href = "../../index.html";

} else {

    trainerProfileName.textContent =
        loggedInTrainer.name || "Trainer";

}


// =============== 4. GET TRAINER'S ASSIGNED MEMBERS ===============

function getMyMembers() {

    // First find classes assigned to logged-in trainer

    const myClasses = classes.filter(function (classItem) {

        return String(classItem.trainerId) ===
            String(loggedInTrainer?.id);

    });

    // Get IDs of those classes

    const myClassIds = myClasses.map(function (classItem) {

        return String(classItem.id);

    });

    // Now find members enrolled in those classes

    const assignedMembers = members.filter(function (member) {

        return myClassIds.includes(String(member.classId));

    });

    return assignedMembers;

}


// =============== 5. LOAD MEMBERS IN DROPDOWN ===============

function loadMembers() {

    const assignedMembers = getMyMembers();

    planMember.innerHTML =
        '<option value="">Select Member</option>';

    assignedMembers.forEach(function (member) {

        const option = document.createElement("option");

        option.value = member.id;

        option.textContent =
            member.name + " (" + member.id + ")";

        planMember.appendChild(option);

    });

}


// =============== 6. SAVE PLANS TO LOCAL STORAGE ===============

function savePlans() {

    localStorage.setItem(
        "workoutPlans",
        JSON.stringify(workoutPlans)
    );

}


// =============== 7. HELPER: SAFE HTML TEXT ===============

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (char) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];

    });

}


// =============== 8. OPEN CREATE PLAN MODAL ===============

function openPlanModal() {

    editPlanId = null;

    workoutPlanForm.reset();

    document.getElementById("modalTitle").textContent =
        "Create Workout Plan";

    loadMembers();

    planModal.style.display = "flex";

}


// =============== 9. CLOSE CREATE / EDIT MODAL ===============

function closePlanModal() {

    planModal.style.display = "none";

    workoutPlanForm.reset();

    editPlanId = null;

}


// =============== 10. CREATE / UPDATE WORKOUT PLAN ===============

workoutPlanForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const selectedMember = getMyMembers().find(function (member) {

        return String(member.id) === String(planMember.value);

    });

    if (!selectedMember) {

        alert("Please select one of your assigned members.");

        return;

    }

    // End date must not be before start date

    if (endDate.value < startDate.value) {

        alert("End date cannot be before start date.");

        return;

    }

    // Check that the selected goal is the member's goal

    const memberGoal = selectedMember.memberGoal;

    if (memberGoal && memberGoal !== planGoal.value) {

        const confirmGoal = confirm(
            "This goal is different from the member's selected goal. Do you want to continue?"
        );

        if (!confirmGoal) return;

    }

    const planData = {

        memberId: selectedMember.id,

        memberName: selectedMember.name,

        trainerId: loggedInTrainer.id,

        goal: planGoal.value,

        startDate: startDate.value,

        endDate: endDate.value,

        workoutSchedule: workoutSchedule.value.trim(),

        exercises: exercises.value.trim(),

        status: planStatus.value

    };


    if (editPlanId !== null) {

        // Find existing plan

        const planIndex = workoutPlans.findIndex(function (plan) {

            return String(plan.id) === String(editPlanId) &&
                String(plan.trainerId) === String(loggedInTrainer.id);

        });

        if (planIndex === -1) {

            alert("Workout plan not found.");

            return;

        }

        // Update existing plan without changing its ID

        workoutPlans[planIndex] = {

            ...workoutPlans[planIndex],

            ...planData

        };

        alert("Workout plan updated successfully!");

    } else {

        // Generate a new plan ID

        const newPlan = {

            id: "WP" + Date.now(),

            ...planData

        };

        workoutPlans.push(newPlan);

        alert("Workout plan created successfully!");

    }

    savePlans();

    closePlanModal();

    displayWorkoutPlans();

    updateDashboardCards();

});


// =============== 11. DISPLAY WORKOUT PLANS ===============

function displayWorkoutPlans() {

    const assignedMemberIds = getMyMembers().map(function (member) {

        return String(member.id);

    });

    // Only show plans belonging to this trainer
    // and their currently assigned members

    let myPlans = workoutPlans.filter(function (plan) {

        return String(plan.trainerId) ===
            String(loggedInTrainer.id) &&
            assignedMemberIds.includes(String(plan.memberId));

    });

    // Search by member name or member ID

    const searchValue = searchPlan.value
        .trim()
        .toLowerCase();

    if (searchValue !== "") {

        myPlans = myPlans.filter(function (plan) {

            const member = members.find(function (item) {

                return String(item.id) === String(plan.memberId);

            });

            const memberName =
                member?.name || plan.memberName || "";

            return memberName.toLowerCase().includes(searchValue) ||
                String(plan.memberId).toLowerCase().includes(searchValue);

        });

    }

    // Filter by goal

    if (goalFilter.value !== "all") {

        myPlans = myPlans.filter(function (plan) {

            return plan.goal === goalFilter.value;

        });

    }

    // Filter by status

    if (statusFilter.value !== "all") {

        myPlans = myPlans.filter(function (plan) {

            return plan.status === statusFilter.value;

        });

    }

    workoutPlansTableBody.innerHTML = "";

    if (myPlans.length === 0) {

        workoutPlansTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    No workout plans found.
                </td>
            </tr>
        `;

        return;

    }

    myPlans.forEach(function (plan) {

        const member = members.find(function (item) {

            return String(item.id) === String(plan.memberId);

        });

        const memberName =
            member?.name || plan.memberName || "Unknown Member";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(plan.id)}</td>

            <td>${escapeHTML(memberName)}</td>

            <td>${escapeHTML(plan.goal)}</td>

            <td>${escapeHTML(plan.startDate)}</td>

            <td>${escapeHTML(plan.endDate)}</td>

            <td>
                <span class="status ${plan.status === "Active"
                    ? "active"
                    : "completed"}">
                    ${escapeHTML(plan.status)}
                </span>
            </td>

            <td>
                <button type="button"
                    class="view-btn"
                    data-action="view"
                    data-id="${escapeHTML(plan.id)}"
                    title="View Details">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button type="button"
                    class="edit-btn"
                    data-action="edit"
                    data-id="${escapeHTML(plan.id)}"
                    title="Edit Plan">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button type="button"
                    class="delete-btn"
                    data-action="delete"
                    data-id="${escapeHTML(plan.id)}"
                    title="Delete Plan">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        workoutPlansTableBody.appendChild(row);

    });

}


// =============== 12. UPDATE DASHBOARD CARDS ===============

function updateDashboardCards() {

    const assignedMembers = getMyMembers();

    const assignedMemberIds = assignedMembers.map(function (member) {

        return String(member.id);

    });

    const myPlans = workoutPlans.filter(function (plan) {

        return String(plan.trainerId) ===
            String(loggedInTrainer.id) &&
            assignedMemberIds.includes(String(plan.memberId));

    });

    totalPlans.textContent = myPlans.length;

    activePlans.textContent = myPlans.filter(function (plan) {

        return plan.status === "Active";

    }).length;

    completedPlans.textContent = myPlans.filter(function (plan) {

        return plan.status === "Completed";

    }).length;

    myMembers.textContent = assignedMembers.length;

}


// =============== 13. VIEW PLAN DETAILS ===============

function viewPlanDetails(id) {

    const plan = workoutPlans.find(function (item) {

        return String(item.id) === String(id) &&
            String(item.trainerId) === String(loggedInTrainer.id);

    });

    if (!plan) {

        alert("Workout plan not found.");

        return;

    }

    const member = members.find(function (item) {

        return String(item.id) === String(plan.memberId);

    });

    document.getElementById("detailPlanId").textContent =
        plan.id || "-";

    document.getElementById("detailMember").textContent =
        member?.name || plan.memberName || "-";

    document.getElementById("detailGoal").textContent =
        plan.goal || "-";

    document.getElementById("detailStartDate").textContent =
        plan.startDate || "-";

    document.getElementById("detailEndDate").textContent =
        plan.endDate || "-";

    document.getElementById("detailStatus").textContent =
        plan.status || "-";

    document.getElementById("detailSchedule").textContent =
        plan.workoutSchedule || "-";

    document.getElementById("detailExercises").textContent =
        plan.exercises || "-";

    detailsModal.style.display = "flex";

}


// =============== 14. EDIT PLAN ===============

function editWorkoutPlan(id) {

    const plan = workoutPlans.find(function (item) {

        return String(item.id) === String(id) &&
            String(item.trainerId) === String(loggedInTrainer.id);

    });

    if (!plan) {

        alert("Workout plan not found.");

        return;

    }

    // Only edit plans for currently assigned members

    const assignedMembers = getMyMembers();

    const isAssigned = assignedMembers.some(function (member) {

        return String(member.id) === String(plan.memberId);

    });

    if (!isAssigned) {

        alert("This member is not assigned to you.");

        return;

    }

    editPlanId = plan.id;

    loadMembers();

    document.getElementById("modalTitle").textContent =
        "Edit Workout Plan";

    planMember.value = plan.memberId;
    planGoal.value = plan.goal;
    startDate.value = plan.startDate;
    endDate.value = plan.endDate;
    workoutSchedule.value = plan.workoutSchedule;
    exercises.value = plan.exercises;
    planStatus.value = plan.status;

    planModal.style.display = "flex";

}


// =============== 15. DELETE PLAN ===============

function deleteWorkoutPlan(id) {

    const plan = workoutPlans.find(function (item) {

        return String(item.id) === String(id) &&
            String(item.trainerId) === String(loggedInTrainer.id);

    });

    if (!plan) {

        alert("Workout plan not found.");

        return;

    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this workout plan?"
    );

    if (!confirmDelete) return;

    workoutPlans = workoutPlans.filter(function (item) {

        return !(String(item.id) === String(id) &&
            String(item.trainerId) === String(loggedInTrainer.id));

    });

    savePlans();

    displayWorkoutPlans();

    updateDashboardCards();

    alert("Workout plan deleted successfully!");

}


// =============== 16. HANDLE TABLE ACTION BUTTONS ===============

workoutPlansTableBody.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "view") {

        viewPlanDetails(id);

    } else if (action === "edit") {

        editWorkoutPlan(id);

    } else if (action === "delete") {

        deleteWorkoutPlan(id);

    }

});


// =============== 17. SEARCH & FILTER EVENTS ===============

searchPlan.addEventListener("input", function () {

    displayWorkoutPlans();

});

goalFilter.addEventListener("change", function () {

    displayWorkoutPlans();

});

statusFilter.addEventListener("change", function () {

    displayWorkoutPlans();

});


// =============== 18. MODAL BUTTON EVENTS ===============

createPlanBtn.addEventListener("click", openPlanModal);

closeModal.addEventListener("click", closePlanModal);

cancelBtn.addEventListener("click", closePlanModal);

closeDetailsModal.addEventListener("click", function () {

    detailsModal.style.display = "none";

});


// Close modals when clicking outside their content

planModal.addEventListener("click", function (event) {

    if (event.target === planModal) {

        closePlanModal();

    }

});

detailsModal.addEventListener("click", function (event) {

    if (event.target === detailsModal) {

        detailsModal.style.display = "none";

    }

});


// =============== 19. LOGOUT ===============

const logoutLink = document.querySelector(".Logout");

if (logoutLink) {

    logoutLink.addEventListener("click", function () {

        localStorage.removeItem("loggedInTrainer");

    });

}


// =============== 20. INITIAL PAGE LOAD ===============

if (loggedInTrainer) {

    loadMembers();

    displayWorkoutPlans();

    updateDashboardCards();

}
