const addMembershipBtn = document.getElementById("addMembershipBtn");
const searchMembership = document.getElementById("searchMembership");
const membershipStatusFilter = document.getElementById("membershipStatusFilter");
const membershipsTableBody = document.getElementById("membershipsTableBody");


let memberships = JSON.parse(localStorage.getItem("memberships")) || [];


// ================= DISPLAY MEMBERSHIPS =================

function displayMemberships(membershipList = memberships) {

    membershipsTableBody.innerHTML = "";

    membershipList.forEach(function(membership) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${membership.id}</td>

            <td>${membership.name}</td>

            <td>${membership.duration}</td>

            <td>Rs. ${Number(membership.price).toLocaleString()}</td>

            <td>${membership.discount}%</td>

            <td>Rs. ${Number(membership.finalPrice).toLocaleString()}</td>

            <td>${membership.trainer}</td>

            <td>${membership.memberLimit}</td>

            
                

            <td>
                <span class="status ${membership.status.toLowerCase()}">
                    ${membership.status}
                </span>
            </td>

            <td class="actions">

                <button
                    class="edit-btn"
                    onclick="editMembership('${membership.id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMembership('${membership.id}')">
                    Delete
                </button>

            </td>`;

        membershipsTableBody.appendChild(row);

    })
}


// ================= ADD MEMBERSHIP BUTTON =================

addMembershipBtn.addEventListener("click", function() {

    window.location.href = "membershipform.html";

});


// ================= SEARCH =================

searchMembership.addEventListener("input", function() {

    const searchValue = searchMembership.value
        .toLowerCase()
        .trim();


    const filteredMemberships = memberships.filter(function(membership) {

        return (
            membership.id.toLowerCase().includes(searchValue) ||
            membership.name.toLowerCase().includes(searchValue) ||
            membership.duration.toLowerCase().includes(searchValue)
        );

    });


    displayMemberships(filteredMemberships);

});


// ================= STATUS FILTER =================

membershipStatusFilter.addEventListener("change", function() {

    const selectedStatus = membershipStatusFilter.value;


    const filteredMemberships = memberships.filter(function(membership) {

        if (selectedStatus === "") {
            return true;
        }

        return membership.status === selectedStatus;

    });


    displayMemberships(filteredMemberships);

});


// ================= EDIT MEMBERSHIP =================

function editMembership(id) {

    localStorage.setItem("editMembershipId", id);

    window.location.href = "membershipform.html";

}


// ================= DELETE MEMBERSHIP =================

function deleteMembership(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this membership?"
    );


    if (!confirmDelete) {
        return;
    }


    memberships = memberships.filter(function(membership) {

        return membership.id !== id;

    });


    localStorage.setItem(
        "memberships",
        JSON.stringify(memberships)
    );


    displayMemberships();

}


// ================= DISPLAY DATA =================

displayMemberships();