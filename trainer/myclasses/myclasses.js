// ================= GET HTML ELEMENTS =================

const classTableBody = document.getElementById("classTableBody");

const totalClasses = document.getElementById("totalClasses");
const todayClasses = document.getElementById("todayClasses");
const activeClasses = document.getElementById("activeClasses");
const totalCapacity = document.getElementById("totalCapacity");

const searchClass = document.getElementById("searchClass");
const dayFilter = document.getElementById("dayFilter");
const categoryFilter = document.getElementById("categoryFilter");

const trainerProfileName =
    document.getElementById("trainerProfileName");

const classModal =
    document.getElementById("classModal");

const closeModal =
    document.getElementById("closeModal");

const logoutBtn =
    document.getElementById("logoutBtn");


// ================= GET LOGGED-IN TRAINER =================

const loggedInTrainer =
    JSON.parse(localStorage.getItem("loggedInTrainer"));


// ================= GET ALL CLASSES =================

const allClasses =
    JSON.parse(localStorage.getItem("classes")) || [];


// ================= CHECK TRAINER LOGIN =================

if (!loggedInTrainer) {

    alert("Trainer is not logged in.");

    window.location.href = "../../index.html";

} else {


    // ================= DISPLAY TRAINER NAME =================

    trainerProfileName.textContent =
        loggedInTrainer.name;


    // ================= GET MY CLASSES =================

    const myClasses =
        allClasses.filter(function(classItem) {

            return classItem.trainerId === loggedInTrainer.id;

        });


    // ================= TODAY =================

    const today =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    // ================= TOTAL CLASSES =================

    totalClasses.textContent =
        myClasses.length;


    // ================= TODAY'S CLASSES =================

    const todayClassList =
        myClasses.filter(function(classItem) {

            return classItem.day === today;

        });


    todayClasses.textContent =
        todayClassList.length;


    // ================= ACTIVE CLASSES =================

    const activeClassList =
        myClasses.filter(function(classItem) {

            return classItem.status === "Active";

        });


    activeClasses.textContent =
        activeClassList.length;


    // ================= TOTAL CAPACITY =================

    let capacity = 0;


    myClasses.forEach(function(classItem) {

        capacity +=
            Number(classItem.capacity) || 0;

    });


    totalCapacity.textContent =
        capacity;


    // ================= DISPLAY CLASSES =================

    function displayClasses(classList) {

        classTableBody.innerHTML = "";


        // No classes

        if (classList.length === 0) {

            classTableBody.innerHTML = `
            
                <tr>

                    <td colspan="9">
                        No classes found.
                    </td>

                </tr>
            
            `;

            return;
        }


        // Display each class

        classList.forEach(function(classItem) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${classItem.id}
                </td>

                <td>
                    ${classItem.name}
                </td>

                <td>
                    ${classItem.category}
                </td>

                <td>
                    ${classItem.day}
                </td>

                <td>
                    ${classItem.startTime}
                    -
                    ${classItem.endTime}
                </td>

                <td>
                    ${classItem.capacity}
                </td>

                <td>
                    ${classItem.location}
                </td>

                <td>
                    ${classItem.status}
                </td>

                <td>

                    <button
                        class="view-btn"
                        onclick="viewClass('${classItem.id}')">

                        <i class="fa-solid fa-eye"></i>

                        View

                    </button>

                </td>

            `;


            classTableBody.appendChild(row);

        });

    }


    // ================= FILTER CLASSES =================

    function applyFilters() {


        const searchValue =
            searchClass.value
                .toLowerCase()
                .trim();


        const selectedDay =
            dayFilter.value;


        const selectedCategory =
            categoryFilter.value;


        const filteredClasses =
            myClasses.filter(function(classItem) {


                // SEARCH

                const matchesSearch =

                    classItem.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    classItem.category
                        .toLowerCase()
                        .includes(searchValue);


                // DAY

                const matchesDay =

                    selectedDay === "all"

                    ||

                    classItem.day === selectedDay;


                // CATEGORY

                const matchesCategory =

                    selectedCategory === "all"

                    ||

                    classItem.category === selectedCategory;


                return (

                    matchesSearch &&

                    matchesDay &&

                    matchesCategory

                );

            });


        displayClasses(filteredClasses);

    }


    // ================= SEARCH =================

    searchClass.addEventListener(
        "input",
        function() {

            applyFilters();

        }
    );


    // ================= DAY FILTER =================

    dayFilter.addEventListener(
        "change",
        function() {

            applyFilters();

        }
    );


    // ================= CATEGORY FILTER =================

    categoryFilter.addEventListener(
        "change",
        function() {

            applyFilters();

        }
    );


    // ================= INITIAL DISPLAY =================

    displayClasses(myClasses);

}


// ================= VIEW CLASS DETAILS =================

function viewClass(classId) {


    const selectedClass =
        allClasses.find(function(classItem) {

            return classItem.id === classId;

        });


    if (!selectedClass) {

        return;

    }


    // Class Name

    document.getElementById(
        "detailClassName"
    ).textContent =
        selectedClass.name;


    // Category

    document.getElementById(
        "detailCategory"
    ).textContent =
        selectedClass.category;


    // Day

    document.getElementById(
        "detailDay"
    ).textContent =
        selectedClass.day;


    // Time

    document.getElementById(
        "detailTime"
    ).textContent =

        selectedClass.startTime
        +
        " - "
        +
        selectedClass.endTime;


    // Capacity

    document.getElementById(
        "detailCapacity"
    ).textContent =
        selectedClass.capacity;


    // Location

    document.getElementById(
        "detailLocation"
    ).textContent =
        selectedClass.location;


    // Status

    document.getElementById(
        "detailStatus"
    ).textContent =
        selectedClass.status;


    // Member logic abhi nahi

const members =
    JSON.parse(localStorage.getItem("members")) || [];

const classMembers = members.filter(function(member) {
    return member.memberClass === selectedClass.id;
});

document.getElementById("detailMembers").textContent =
    classMembers.length;



    // Open Modal

    classModal.style.display =
        "flex";

}


// ================= CLOSE MODAL =================

closeModal.addEventListener(
    "click",
    function() {

        classModal.style.display =
            "none";

    }
);


// ================= CLOSE MODAL OUTSIDE =================

classModal.addEventListener(
    "click",
    function(event) {

        if (event.target === classModal) {

            classModal.style.display =
                "none";

        }

    }
);


// ================= LOGOUT =================

function logoutUser() {


    // Remove trainer login

    localStorage.removeItem(
        "loggedInTrainer"
    );


    // Go to login page

    window.location.href =
        "../../index.html";

}


// ================= LOGOUT BUTTON =================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            logoutUser();

        }
    );

}