
const login = document.getElementById("loginbtn");

login.addEventListener("click", function () {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;


    // ================= ADMIN LOGIN =================

    if (
        username === "Admin" &&
        password === "12345" &&
        role === "Admin"
    ) {

        alert("Admin Login Successful");

        window.location.href = "admin/dashboard/admin.html";

        return;
    }


    // ================= TRAINER LOGIN =================

    if (role === "Trainer") {

        // Trainers ko localStorage se lena
        const trainers =
            JSON.parse(localStorage.getItem("trainers")) || [];


        // Name aur password match karna
        const trainer = trainers.find(function (trainer) {

            return (
                trainer.name.toLowerCase() === username.toLowerCase() &&
                trainer.password === password
            );

        });


        // Trainer mil gaya
        if (trainer) {

            // Logged-in trainer ko save karna
            localStorage.setItem(
                "loggedInTrainer",
                JSON.stringify(trainer)
            );

            alert("Trainer Login Successful");

            window.location.href = "../trainer/trainer.html";

            return;
        }

    }


    // ================= INVALID LOGIN =================

    alert("Invalid credentials");

});

