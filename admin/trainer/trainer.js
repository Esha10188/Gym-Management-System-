const addTrainerBtn = document.getElementById("addTrainerBtn");
const searchTrainer = document.getElementById("searchTrainer");
const trainerStatusFilter = document.getElementById("trainerStatusFilter");
const trainersTableBody = document.querySelector("table tbody");


// LocalStorage se trainers lena
let trainers = JSON.parse(localStorage.getItem("trainers")) || [];


// Trainers ko table mein show karna
function displayTrainers(trainerList = trainers) {

    trainersTableBody.innerHTML = "";

    trainerList.forEach(function(trainer) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${trainer.id}</td>
            <td>${trainer.name}</td>
            <td>${trainer.email}</td>
            <td>${trainer.phone}</td>
            <td>${trainer.cnic}</td>
            <td>${trainer.specialization}</td>
            <td>${trainer.experience}</td>
            <td>${trainer.joiningDate}</td>

            <td>
                <span class="status ${trainer.status.toLowerCase()}">
                    ${trainer.status}
                </span>
            </td>

            <td class="actions">
                <button class="edit-btn" onclick="editTrainer('${trainer.id}')">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteTrainer('${trainer.id}')">
                    Delete
                </button>
            </td>
        `;

        trainersTableBody.appendChild(row);
    });
}


// Add Trainer button
addTrainerBtn.addEventListener("click", function() {

    window.location.href = "addtrainer.html";

});


// Search Trainer
searchTrainer.addEventListener("input", function() {

    const searchValue = searchTrainer.value.toLowerCase().trim();

    const filteredTrainers = trainers.filter(function(trainer) {

        return (
            trainer.id.toLowerCase().includes(searchValue) ||
            trainer.name.toLowerCase().includes(searchValue) ||
            trainer.cnic.toLowerCase().includes(searchValue) ||
            trainer.phone.toLowerCase().includes(searchValue)
        );

    });

    displayTrainers(filteredTrainers);

});


// Status Filter
trainerStatusFilter.addEventListener("change", function() {

    const selectedStatus = trainerStatusFilter.value;

    const filteredTrainers = trainers.filter(function(trainer) {

        if (selectedStatus === "") {
            return true;
        }

        return trainer.status === selectedStatus;

    });

    displayTrainers(filteredTrainers);

});


// Delete Trainer
function deleteTrainer(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this trainer?"
    );

    if (!confirmDelete) {
        return;
    }

    trainers = trainers.filter(function(trainer) {

        return trainer.id !== id;

    });

    localStorage.setItem("trainers", JSON.stringify(trainers));

    displayTrainers();

}


// Edit Trainer
function editTrainer(id) {

    localStorage.setItem("editTrainerId", id);

    window.location.href = "addtrainer.html";

}


// Page load hote hi trainers show karo
displayTrainers();