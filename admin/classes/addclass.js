

const className = document.getElementById("className");
const classCategory = document.getElementById("classCategory");
const classTrainer = document.getElementById("classTrainer");
// ================= LOAD TRAINERS =================

const trainers = JSON.parse(localStorage.getItem("trainers")) || [];

function loadTrainersBySpecialization() {

    const selectedCategory = classCategory.value;

    classTrainer.innerHTML =
        '<option value="">Select Trainer</option>';

    trainers.forEach(function(trainer) {

        if (trainer.specialization === selectedCategory) {

            const option = document.createElement("option");

            option.value = trainer.id;
            option.textContent = trainer.name;

            classTrainer.appendChild(option);
        }
    });
}
classCategory.addEventListener("change", function() {
    loadTrainersBySpecialization();
});


const classDay = document.getElementById("classDay");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");
const capacity = document.getElementById("capacity");
const classlocation = document.getElementById("location");
const classStatus = document.getElementById("classStatus");

const saveClass = document.getElementById("saveClass");
const cancelClass = document.getElementById("cancelClass");


// ================= GET CLASSES =================

let classes = JSON.parse(localStorage.getItem("classes")) || [];

const editClassId = localStorage.getItem("editClassId");


// ================= EDIT CLASS =================

if (editClassId) {

    const classData = classes.find(function(classItem) {
        return classItem.id === editClassId;
    });

    if (classData) {

        className.value = classData.name;
        classCategory.value = classData.category;
        loadTrainersBySpecialization();
        classTrainer.value = classData.trainerId;
        classDay.value = classData.day;
        startTime.value = classData.startTime;
        endTime.value = classData.endTime;
        capacity.value = classData.capacity;
        classlocation.value = classData.location;
        classStatus.value = classData.status;

    }
}


// ================= SAVE CLASS =================

saveClass.addEventListener("click", function() {

    // Validation

    if (
        className.value.trim() === "" ||
        classCategory.value === "" ||
        classTrainer.value === "" ||
        classDay.value === "" ||
        startTime.value === "" ||
        endTime.value === "" ||
        capacity.value === "" ||
        classlocation.value === "" ||
        classStatus.value === ""
    ) {

        alert("Please fill all fields.");
        return;

    }


    // ================= UPDATE EXISTING CLASS =================

    if (editClassId) {

        const classIndex = classes.findIndex(function(classItem) {
            return classItem.id === editClassId;
        });

        if (classIndex !== -1) {

            classes[classIndex].name = className.value.trim();
            classes[classIndex].category = classCategory.value;
            classes[classIndex].trainerId = classTrainer.value;
            classes[classIndex].day = classDay.value;
            classes[classIndex].startTime = startTime.value;
            classes[classIndex].endTime = endTime.value;
            classes[classIndex].capacity = Number(capacity.value);
            classes[classIndex].location = classlocation.value;
            classes[classIndex].status = classStatus.value;

            localStorage.setItem("classes", JSON.stringify(classes));

            localStorage.removeItem("editClassId");

            alert("Class updated successfully!");

            window.location.href = "classes.html";
        }

        return;
    }


    // ================= ADD NEW CLASS =================

    const newClass = {

        id: "CL" + String(classes.length + 1).padStart(3, "0"),

        name: className.value.trim(),

        category: classCategory.value,

        trainerId: classTrainer.value,

        day: classDay.value,

        startTime: startTime.value,

        endTime: endTime.value,

        capacity: Number(capacity.value),

        location: classlocation.value,

        status: classStatus.value

    };


    classes.push(newClass);

    localStorage.setItem("classes", JSON.stringify(classes));

    alert("Class added successfully!");

    window.location.href = "classes.html";

});


// ================= CANCEL =================

cancelClass.addEventListener("click", function() {

    localStorage.removeItem("editClassId");

    window.location.href = "classes.html";

});

