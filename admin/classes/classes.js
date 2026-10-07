const addClassBtn = document.getElementById("addClassBtn");
const searchClass = document.getElementById("searchClass");
const trainerFilter = document.getElementById("trainerFilter");
const dayFilter = document.getElementById("dayFilter");
const categoryFilter = document.getElementById("categoryFilter");

let classes = JSON.parse(localStorage.getItem("classes")) || [];


// ============ ADD CLASS ============

addClassBtn.addEventListener("click", function () {

    window.location.href = "addclass.html";

});


// ============ LOAD TRAINERS ============

function loadTrainerFilter() {

    const trainers =
        JSON.parse(localStorage.getItem("trainers")) || [];

    trainerFilter.innerHTML = `
        <option value="">All Trainers</option>
    `;

    trainers.forEach(function (trainer) {

        if (trainer.status === "Active") {

            const option = document.createElement("option");

            option.value = trainer.name;

            option.textContent = trainer.name;

            trainerFilter.appendChild(option);

        }

    });

}


// ============ DISPLAY CLASSES ============

function displayClasses(classList = classes) {

    const scheduleGrid =
        document.querySelector(".schedule-grid");

    scheduleGrid.innerHTML = "";


    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];


    days.forEach(function (day) {

        const dayColumn =
            document.createElement("div");

        dayColumn.className = "day-column";


        const dayHeading =
            document.createElement("h3");

        dayHeading.textContent = day;

        dayColumn.appendChild(dayHeading);


        const dayClasses =
            classList.filter(function (classItem) {

                return classItem.day === day;

            });


        dayClasses.forEach(function (classItem) {

            const classCard =
                document.createElement("div");

            classCard.className = "class-card";


            classCard.innerHTML = `
                
                <h4>${classItem.name}</h4>

                <p>Trainer: ${classItem.trainer}</p>

                <p>
                    ${classItem.startTime} - ${classItem.endTime}
                </p>

                <p>Category: ${classItem.category}</p>

                <span>${classItem.location}</span>

                <div class="class-actions">

                    <button onclick="editClass('${classItem.id}')">
                        Edit
                    </button>

                    <button onclick="deleteClass('${classItem.id}')">
                        Delete
                    </button>

                </div>

            `;


            dayColumn.appendChild(classCard);

        });


        scheduleGrid.appendChild(dayColumn);

    });

}


// ============ SEARCH ============

searchClass.addEventListener("input", function () {

    applyFilters();

});


// ============ TRAINER FILTER ============

trainerFilter.addEventListener("change", function () {

    applyFilters();

});


// ============ DAY FILTER ============

dayFilter.addEventListener("change", function () {

    applyFilters();

});


// ============ CATEGORY FILTER ============

categoryFilter.addEventListener("change", function () {

    applyFilters();

});


// ============ APPLY FILTERS ============

function applyFilters() {

    const searchValue =
        searchClass.value.toLowerCase().trim();


    const selectedTrainer =
        trainerFilter.value;

    const selectedDay =
        dayFilter.value;

    const selectedCategory =
        categoryFilter.value;


    const filteredClasses =
        classes.filter(function (classItem) {

            const matchesSearch =
                classItem.name.toLowerCase().includes(searchValue) ||
                classItem.trainer.toLowerCase().includes(searchValue) ||
                classItem.category.toLowerCase().includes(searchValue);


            const matchesTrainer =
                selectedTrainer === "" ||
                classItem.trainer === selectedTrainer;


            const matchesDay =
                selectedDay === "" ||
                classItem.day === selectedDay;


            const matchesCategory =
                selectedCategory === "" ||
                classItem.category === selectedCategory;


            return (
                matchesSearch &&
                matchesTrainer &&
                matchesDay &&
                matchesCategory
            );

        });


    displayClasses(filteredClasses);

}


// ============ EDIT CLASS ============

function editClass(id) {

    localStorage.setItem("editClassId", id);

    window.location.href = "addclass.html";

}


// ============ DELETE CLASS ============

function deleteClass(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this class?"
    );


    if (!confirmDelete) {

        return;

    }


    classes =
        classes.filter(function (classItem) {

            return classItem.id !== id;

        });


    localStorage.setItem(
        "classes",
        JSON.stringify(classes)
    );


    displayClasses();

    updateSummary();

    displayUpcomingClasses();

}


// ============ SUMMARY CARDS ============

function updateSummary() {

    const trainers =
        JSON.parse(localStorage.getItem("trainers")) || [];


    // Today's day

    const today =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    // Today's active classes

    const todayClasses =
        classes.filter(function (classItem) {

            return (
                classItem.day === today &&
                classItem.status === "Active"
            );

        });


    // Active trainers

    const activeTrainers =
        trainers.filter(function (trainer) {

            return trainer.status === "Active";

        });


    // Total seats

    let totalSeats = 0;


    classes.forEach(function (classItem) {

        if (classItem.status === "Active") {

            totalSeats +=
                Number(classItem.capacity) || 0;

        }

    });


    // Available seats

    const availableSeats = totalSeats;


    // Display

    document.getElementById("todayClasses").textContent =
        todayClasses.length;


    document.getElementById("activeTrainers").textContent =
        activeTrainers.length;


    document.getElementById("totalSeats").textContent =
        totalSeats;


    document.getElementById("availableSeats").textContent =
        availableSeats;

}




// ============ UPCOMING CLASSES ============

function displayUpcomingClasses() {

    const upcomingList =
        document.getElementById("upcomingClassesList");

    upcomingList.innerHTML = "";


    const today = new Date();

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];


    const currentDayIndex = today.getDay();

    const currentTime =
        today.getHours() * 60 + today.getMinutes();


    const upcomingClasses = [];


    classes.forEach(function (classItem) {

        // Sirf Active classes
        if (classItem.status !== "Active") {
            return;
        }


        const classDayIndex =
            dayNames.indexOf(classItem.day);


        if (classDayIndex === -1) {
            return;
        }


        // Next class kitne din baad hai
        let daysUntilClass =
            classDayIndex - currentDayIndex;


        if (daysUntilClass < 0) {
            daysUntilClass += 7;
        }


        // Class ka time calculate karna
        let classTime = 0;


        if (classItem.startTime) {

            const timeParts =
                classItem.startTime.match(
                    /(\d+):(\d+)\s*(AM|PM)/i
                );


            if (timeParts) {

                let hour =
                    Number(timeParts[1]);

                const minute =
                    Number(timeParts[2]);

                const period =
                    timeParts[3].toUpperCase();


                if (period === "PM" && hour !== 12) {
                    hour += 12;
                }


                if (period === "AM" && hour === 12) {
                    hour = 0;
                }


                classTime =
                    hour * 60 + minute;

            }

        }


        // Agar class aaj ki hai aur time guzar chuka hai
        if (
            daysUntilClass === 0 &&
            classTime < currentTime
        ) {

            daysUntilClass = 7;

        }


        // Next upcoming date
        const upcomingDate =
            new Date(today);


        upcomingDate.setDate(
            today.getDate() + daysUntilClass
        );


        upcomingClasses.push({
            classItem: classItem,
            date: upcomingDate,
            daysUntilClass: daysUntilClass,
            classTime: classTime
        });

    });


    // Nearest classes pehle
    upcomingClasses.sort(function (a, b) {

        return (
            a.daysUntilClass - b.daysUntilClass ||
            a.classTime - b.classTime
        );

    });


    // Agar koi upcoming class nahi
    if (upcomingClasses.length === 0) {

        upcomingList.innerHTML = `
            <p>No upcoming classes.</p>
        `;

        return;

    }


    // Cards display
    upcomingClasses.forEach(function (item) {

        const classItem =
            item.classItem;


        const dateText =
            item.date.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );


        const upcomingCard =
            document.createElement("div");


        upcomingCard.className =
            "upcoming-card";


        upcomingCard.innerHTML = `

            <div>

                <h3>${classItem.name}</h3>

                <p>
                    ${dateText} · ${classItem.startTime}
                </p>

                <p>
                    Trainer: ${classItem.trainer}
                </p>

            </div>

            <span>
                ${classItem.capacity} Seats Available
            </span>

        `;


        upcomingList.appendChild(upcomingCard);

    });

}


// ============ INITIAL DISPLAY ============

loadTrainerFilter();

displayClasses();

updateSummary();

displayUpcomingClasses();