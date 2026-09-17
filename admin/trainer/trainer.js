const searchTrainer = document.getElementById("searchTrainer");
const trainerTable = document.querySelector("table");
const trainerRows = trainerTable.querySelectorAll("tbody tr");

searchTrainer.addEventListener("input", function () {

    const searchValue = searchTrainer.value.toLowerCase().trim();

    trainerRows.forEach(function (row) {

        const trainerName = row.cells[1].textContent.toLowerCase();

        if (trainerName.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});