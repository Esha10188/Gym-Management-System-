
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
    localStorage.setItem("loggedInAdmin", "Admin");
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
    

// ================= MEMBER LOGIN =================

if (role === "Member") {

    const members =
        JSON.parse(localStorage.getItem("members")) || [];

    // Check 1: Members save hain ya nahi
    if (members.length === 0) {
        alert("No members found! Please check saved member data.");
        return;
    }

    // Check 2: Username match karna
    const member = members.find(function (member) {
        return (
            member.name.toLowerCase() === username.toLowerCase()
        );
    });

    if (!member) {
        alert("Username does not match any saved member.");
        return;
    }

    // Check 3: Password match karna
    if (member.password !== password) {
        alert("Username found, but password is incorrect.");
        return;
    }

    // Login successful
    localStorage.setItem(
        "loggedInMember",
        JSON.stringify(member)
    );

    alert("Member Login Successful");

    window.location.href = "member/member.html";
    return;
}
});