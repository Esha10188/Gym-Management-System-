const attendanceDate = document.getElementById("attendanceDate");
const searchMember = document.getElementById("searchMember");
const statusFilter = document.getElementById("statusFilter");

const attendanceMember =
    document.getElementById("attendanceMember");

const presentBtn =
    document.getElementById("presentBtn");

const attendanceTableBody =
    document.querySelector("tbody");


// ================= MEMBERS =================

let members =
    JSON.parse(localStorage.getItem("members")) || [];


// ================= ATTENDANCE =================

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];


// ================= TODAY'S DATE =================

const today = new Date();

const todayDate =
    today.toISOString().split("T")[0];

attendanceDate.value = todayDate;


// ================= SAVE ATTENDANCE =================

function saveAttendance() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// ================= GET TODAY'S RECORD =================

function getTodayRecord(memberId) {

    return attendance.find(function (record) {

        return (
            record.memberId === memberId &&
            record.date === attendanceDate.value
        );

    });
}


// ================= FORMAT TIME =================

function getCurrentTime() {

    return new Date().toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ================= DISPLAY ATTENDANCE =================

function displayAttendance() {

    attendanceTableBody.innerHTML = "";

    const searchValue =
        searchMember.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;


    // Sirf Active members
    let activeMembers =
        members.filter(function (member) {

            return member.status === "Active";

        });


    activeMembers.forEach(function (member) {

        const record =
            getTodayRecord(member.id);


        let status = "Absent";

        let checkIn = "-";

        let checkOut = "-";


        if (record) {

            status = record.status;

            checkIn =
                record.checkIn || "-";

            checkOut =
                record.checkOut || "-";
        }


        // Search
        const matchesSearch =
            member.name
                .toLowerCase()
                .includes(searchValue) ||

            String(member.id)
                .toLowerCase()
                .includes(searchValue);


        // Status Filter
        const matchesStatus =
            selectedStatus === "all" ||
            selectedStatus === status.toLowerCase();


        if (
            !matchesSearch ||
            !matchesStatus
        ) {
            return;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${String(member.id).padStart(3, "0")}
            </td>

            <td>
                ${member.name}
            </td>

            <td>
                ${member.membership}
            </td>

            <td>
                ${checkIn}
            </td>

            <td>
                ${checkOut}
            </td>

            <td>
                ${status}
            </td>

            <td>

                ${status === "Present"
                ?

                `<button
                        onclick="checkOutMember('${member.id}')">
                        Check-out
                    </button>`

                :

                `<button
                        onclick="markPresent('${member.id}')">
                        Mark Present
                    </button>`
            }

            </td>
        `;


        attendanceTableBody.appendChild(row);

    });


    updateSummary();
}


// ================= MARK PRESENT =================

function markPresent(memberId) {

    const existingRecord =
        getTodayRecord(memberId);


    if (existingRecord) {

        alert("This member is already marked present.");

        return;
    }


    const newRecord = {

        memberId: memberId,

        date: attendanceDate.value,

        checkIn: getCurrentTime(),

        checkOut: "",

        status: "Present"

    };


    attendance.push(newRecord);

    saveAttendance();

    displayAttendance();

}


// ================= CHECK OUT =================

function checkOutMember(memberId) {

    const record =
        getTodayRecord(memberId);


    if (!record) {

        return;
    }


    if (record.checkOut) {

        alert("This member has already checked out.");

        return;
    }


    record.checkOut =
        getCurrentTime();


    saveAttendance();

    displayAttendance();

}


// ================= QUICK ATTENDANCE =================

presentBtn.addEventListener(
    "click",
    function () {

        const searchValue =
            attendanceMember.value
                .toLowerCase()
                .trim();


        if (!searchValue) {

            alert("Please enter member name or ID.");

            return;
        }


        const member =
            members.find(function (member) {

                return (

                    member.status === "Active" &&

                    (
                        member.name
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        String(member.id)
                            .toLowerCase()
                            .includes(searchValue)
                    )

                );

            });


        if (!member) {

            alert("Active member not found.");

            return;
        }


        markPresent(member.id);


        attendanceMember.value = "";

    }
);


// ================= SEARCH =================

searchMember.addEventListener(
    "input",
    function () {

        displayAttendance();

    }
);


// ================= STATUS FILTER =================

statusFilter.addEventListener(
    "change",
    function () {

        displayAttendance();

    }
);


// ================= DATE CHANGE =================

attendanceDate.addEventListener(
    "change",
    function () {

        displayAttendance();

    }
);


// ================= SUMMARY =================

function updateSummary() {

    const activeMembers =
        members.filter(function (member) {

            return member.status === "Active";

        });


    let presentCount = 0;


    activeMembers.forEach(function (member) {

        const record =
            getTodayRecord(member.id);


        if (
            record &&
            record.status === "Present"
        ) {

            presentCount++;

        }

    });


    const totalMembers =
        activeMembers.length;


    const absentCount =
        totalMembers - presentCount;


    let attendanceRate = 0;


    if (totalMembers > 0) {

        attendanceRate =
            Math.round(
                (presentCount / totalMembers) * 100
            );

    }


    document.getElementById(
        "totalMembers"
    ).textContent = totalMembers;


    document.getElementById(
        "presentToday"
    ).textContent = presentCount;


    document.getElementById(
        "absentToday"
    ).textContent = absentCount;


    document.getElementById(
        "attendanceRate"
    ).textContent =
        attendanceRate + "%";

}


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "../../index.html";

        }
    );


// ================= INITIAL LOAD =================

displayAttendance();