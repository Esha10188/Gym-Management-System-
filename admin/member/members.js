
// 1. GET HTML ELEMENTS


const addMemberBtn = document.getElementById("addMemberBtn");

const searchMember = document.getElementById("searchMember");

const memberStatus = document.getElementById("memberStatus");

const membersTableBody = document.getElementById("membersTableBody");





// 2. GET MEMBERS FROM LOCAL STORAGE


let members = JSON.parse(localStorage.getItem("members")) || [];



// 3. DISPLAY MEMBERS IN TABLE


function displayMembers(memberList = members) {

    membersTableBody.innerHTML = "";

    memberList.forEach(function(member) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${String(member.id).padStart(3, "0")}</td>

            <td>${member.name}</td>

            <td>${member.email}</td>

            <td>${member.phone}</td>

            <td>${member.cnic}</td>

            <td>${member.membership}</td>

            <td>${member.duration}</td>

            <td>${member.joinDate}</td>

            <td>${member.expiryDate}</td>

            <td>${member.gender}</td>

            <td>${member.address}</td>

            <td>
                <span class="status ${member.status.toLowerCase()}">
                    ${member.status}
                </span>
            </td>

            <td class="actions">

                <button
                    class="edit-btn"
                    onclick="editMember(${member.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMember(${member.id})">
                    Delete
                </button>

            </td>`;

        membersTableBody.appendChild(row);
     })

}


// 4. ADD MEMBER BUTTON


addMemberBtn.addEventListener("click", function() {

    window.location.href = "addform.html";

})



// 5. SEARCH MEMBERs

searchMember.addEventListener("input", function() {

    const searchValue = searchMember.value
        .toLowerCase()
        .trim();


    const filteredMembers = members.filter(function(member) {

        return (

            String(member.id)
                .toLowerCase()
                .includes(searchValue) || member.name
                .toLowerCase()
                .includes(searchValue)|| member.cnic
                .toLowerCase()
                .includes(searchValue) ||  member.phone
                .toLowerCase()
                .includes(searchValue)

        )

    })


    displayMembers(filteredMembers);

})



// 6. FILTER BY STATUS


memberStatus.addEventListener("change", function() {

    const selectedStatus = memberStatus.value;


    const filteredMembers = members.filter(function(member) {

        if (selectedStatus === "") {

            return true;

        }

        return member.status === selectedStatus;

    })


    displayMembers(filteredMembers);

})


// 7. DELETE MEMBERs

function deleteMember(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this member?"
    );


    if (!confirmDelete) {

        return;

    }


    members = members.filter(function(member) {

        return member.id !== id;

    });


    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );


    displayMembers();

}



// 8. EDIT MEMBER


function editMember(id) {

    const member = members.find(function(member) {

        return member.id === id;

    });


    if (!member) {

        return;

    }


    localStorage.setItem(
        "editMemberId",
        id
    );


    window.location.href = "addform.html";

}

// 10. DISPLAY MEMBERS WHEN PAGE LOADS

displayMembers();