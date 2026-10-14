const trainerName = document.getElementById("trainerName");
const trainerEmail = document.getElementById("trainerEmail");
const trainerPhone = document.getElementById("trainerPhone");
const trainerCNIC = document.getElementById("trainerCNIC");
const trainerGender = document.getElementById("trainerGender");
const specialization = document.getElementById("specialization");
const experience = document.getElementById("experience");
const joiningDate = document.getElementById("joiningDate");
const salary = document.getElementById("salary");
const trainerAddress = document.getElementById("trainerAddress");

const saveTrainer = document.getElementById("saveTrainer");
const cancelTrainer = document.getElementById("cancelTrainer");


let trainers = JSON.parse(localStorage.getItem("trainers")) || [];
function generatePassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let password = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

const editTrainerId = localStorage.getItem("editTrainerId");


// EDIT MODE
if (editTrainerId) {

    const trainer = trainers.find(function(trainer) {
        return trainer.id === editTrainerId;
    });

    if (trainer) {

        trainerName.value = trainer.name;
        trainerEmail.value = trainer.email;
        trainerPhone.value = trainer.phone;
        trainerCNIC.value = trainer.cnic;
        trainerGender.value = trainer.gender;
        specialization.value = trainer.specialization;
        experience.value = trainer.experience;
        joiningDate.value = trainer.joiningDate;
        salary.value = trainer.salary;
        trainerAddress.value = trainer.address;

    }
}


// SAVE BUTTON
saveTrainer.addEventListener("click", function() {

    if (
        trainerName.value.trim() === "" ||
        trainerEmail.value.trim() === "" ||
        trainerPhone.value.trim() === "" ||
        trainerCNIC.value.trim() === "" ||
        trainerGender.value === "" ||
        specialization.value === "" ||
        experience.value === "" ||
        joiningDate.value === "" ||
        salary.value === "" ||
        trainerAddress.value.trim() === ""
    ) {

        alert("Please fill all fields.");
        return;
    }


    // EDIT EXISTING TRAINER
    if (editTrainerId) {

        const trainerIndex = trainers.findIndex(function(trainer) {
            return trainer.id === editTrainerId;
        });

        if (trainerIndex !== -1) {

            trainers[trainerIndex].name = trainerName.value.trim();
            trainers[trainerIndex].email = trainerEmail.value.trim();
            trainers[trainerIndex].phone = trainerPhone.value.trim();
            trainers[trainerIndex].cnic = trainerCNIC.value.trim();
            trainers[trainerIndex].gender = trainerGender.value;
            trainers[trainerIndex].specialization = specialization.value;
            trainers[trainerIndex].experience = experience.value;
            trainers[trainerIndex].joiningDate = joiningDate.value;
            trainers[trainerIndex].salary = salary.value;
            trainers[trainerIndex].address = trainerAddress.value.trim();

            localStorage.setItem("trainers", JSON.stringify(trainers));

            localStorage.removeItem("editTrainerId");

            alert("Trainer updated successfully!");

            window.location.href = "trainer.html";
        }

        return;
    }


    // ADD NEW TRAINER
    const generatedPassword = generatePassword();



    const newTrainer = {

        id: "TR" + String(trainers.length + 1).padStart(3, "0"),

        name: trainerName.value.trim(),
        email: trainerEmail.value.trim(),
        phone: trainerPhone.value.trim(),
        cnic: trainerCNIC.value.trim(),
        gender: trainerGender.value,
        specialization: specialization.value,
        experience: experience.value,
        joiningDate: joiningDate.value,
        salary: salary.value,
        address: trainerAddress.value.trim(),
        status: "Active",
        password: generatePassword()

    };


 trainers.push(newTrainer);

localStorage.setItem("trainers", JSON.stringify(trainers));

alert(
    "Trainer added successfully!\n\n" +
    "Trainer Name: " + newTrainer.name +
    "\nPassword: " + newTrainer.password
);

window.location.href = "trainer.html";

});


// CANCEL BUTTON
cancelTrainer.addEventListener("click", function() {

    localStorage.removeItem("editTrainerId");

    window.location.href = "trainer.html";

});