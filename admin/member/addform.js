
// GET HTML ELEMENTS

const memberName = document.getElementById("memberName");
const memberEmail = document.getElementById("memberEmail");
const memberPhone = document.getElementById("memberPhone");
const memberCNIC = document.getElementById("memberCNIC");

const membership = document.getElementById("membership");
const membershipDuration = document.getElementById("membershipDuration");
const memberGoal = document.getElementById("memberGoal");
const memberClass = document.getElementById("memberClass");
const joinDate = document.getElementById("joinDate");
const expiryDate = document.getElementById("expiryDate");

const gender = document.getElementById("gender");
const address = document.getElementById("address");

const saveMember = document.getElementById("saveMember");
const cancelMember = document.getElementById("cancelMember");



// GET MEMBERS FROM LOCAL STORAGE

let members = JSON.parse(localStorage.getItem("members")) || [];
const classes = JSON.parse(localStorage.getItem("classes")) || [];

function loadClassesByGoal() {

    const selectedGoal = memberGoal.value;

    memberClass.innerHTML =
        '<option value="">Select Class</option>';

    classes.forEach(function (classItem) {

        if (classItem.category === selectedGoal) {

            const option = document.createElement("option");

            option.value = classItem.id;
            option.textContent = classItem.name;

            memberClass.appendChild(option);
        }
    });
}


// 5. GOAL CHANGE

memberGoal.addEventListener("change", function () {

    loadClassesByGoal();

});



// CHECK EDIT MODE


const editMemberId = localStorage.getItem("editMemberId");

// EDIT MEMBER DATA


if (editMemberId) {

    const member = members.find(function (member) {
        return member.id === Number(editMemberId);
    });

    if (member) {

        memberName.value = member.name;
        memberEmail.value = member.email;
        memberPhone.value = member.phone;
        memberCNIC.value = member.cnic;

        membership.value = member.membership;
        membershipDuration.value = member.duration;
        memberGoal.value = member.goal;
        
            loadClassesByGoal();
        memberClass.value = member.classId;


        joinDate.value = member.joinDate;
        expiryDate.value = member.expiryDate;

        gender.value = member.gender;
        address.value = member.address;

    }

}



// SAVE MEMBER


saveMember.addEventListener("click", function () {

    // Check empty fields

    if (
        memberName.value.trim() === "" ||
        memberEmail.value.trim() === "" ||
        memberPhone.value.trim() === "" ||
        memberCNIC.value.trim() === "" ||
        membership.value === "" ||
        membershipDuration.value === "" ||

        memberGoal.value === "" ||
        memberClass.value === "" ||
        joinDate.value === "" ||
        expiryDate.value === "" ||
        gender.value === "" ||
        address.value.trim() === ""
    ) {

        alert("Please fill all fields.");

        return;

    }
    // EDIT EXISTING MEMBER


    if (editMemberId) {

        const memberIndex = members.findIndex(function (member) {

            return member.id === Number(editMemberId);

        });


        if (memberIndex !== -1) {

            members[memberIndex].name = memberName.value.trim();
            members[memberIndex].email = memberEmail.value.trim();
            members[memberIndex].phone = memberPhone.value.trim();
            members[memberIndex].cnic = memberCNIC.value.trim();

            members[memberIndex].membership = membership.value;
            members[memberIndex].duration = membershipDuration.value;
            members[memberIndex].goal = memberGoal.value;

            members[memberIndex].classId = memberClass.value;
            const selectedClass = classes.find(function (classItem) {
                return classItem.id === memberClass.value;
            });

            members[memberIndex].trainerId = selectedClass.trainerId;

            members[memberIndex].joinDate = joinDate.value;
            members[memberIndex].expiryDate = expiryDate.value;

            members[memberIndex].gender = gender.value;
            members[memberIndex].address = address.value.trim();


            localStorage.setItem(
                "members",
                JSON.stringify(members)
            );


            localStorage.removeItem("editMemberId");


            alert("Member updated successfully!");

            window.location.href = "members.html";

        }

        return;

    }
    // CREATE NEW MEMBER

    const selectedClass = classes.find(function (classItem) {
        return classItem.id === memberClass.value;
    });
    const newMember = {

        id: members.length + 1,

        name: memberName.value.trim(),

        email: memberEmail.value.trim(),

        phone: memberPhone.value.trim(),

        cnic: memberCNIC.value.trim(),

        membership: membership.value,

        duration: membershipDuration.value,
        goal: memberGoal.value,
        classId: memberClass.value,
        trainerId: selectedClass.trainerId,

        joinDate: joinDate.value,

        expiryDate: expiryDate.value,

        gender: gender.value,

        address: address.value.trim(),

        status: "Active"

    };
    // Add member to array

    members.push(newMember);

    // Save updated array

    localStorage.setItem("members", JSON.stringify(members));
    alert("Member added successfully!");

    // Go back to Members page

    window.location.href = "members.html";

});
// CANCEL BUTTON

cancelMember.addEventListener("click", function () {

    localStorage.removeItem("editMemberId");

    window.location.href = "members.html";

});