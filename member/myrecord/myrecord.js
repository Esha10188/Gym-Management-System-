
/* ==========================================
   POWERFIT - MY RECORDS
========================================== */

// ================= GET HTML ELEMENTS =================

const memberName = document.getElementById("memberName");

const totalAttendance = document.getElementById("totalAttendance");
const absentDays = document.getElementById("absentDays");
const totalPaid = document.getElementById("totalPaid");

const membershipType = document.getElementById("membershipType");
const membershipDuration = document.getElementById("membershipDuration");
const joiningDate = document.getElementById("joiningDate");
const membershipExpiry = document.getElementById("membershipExpiry");
const membershipStatus = document.getElementById("membershipStatus");

const attendanceDateFilter =
    document.getElementById("attendanceDateFilter");

const attendanceStatusFilter =
    document.getElementById("attendanceStatusFilter");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const paymentTableBody =
    document.getElementById("paymentTableBody");


// ================= SAFE LOCALSTORAGE DATA =================

function getStorageData(key) {

    try {

        const data = JSON.parse(localStorage.getItem(key));

        return Array.isArray(data) ? data : [];

    } catch (error) {

        console.log("Invalid data in localStorage:", key);

        return [];

    }

}

const members = getStorageData("members");
const attendance = getStorageData("attendance");
const payments = getStorageData("payments");


// ================= GET LOGGED-IN MEMBER =================

let loggedInMember = null;

try {

    loggedInMember = JSON.parse(
        localStorage.getItem("loggedInMember")
    );

} catch (error) {

    console.log("Invalid member login data.");

}


// ================= FIND CURRENT MEMBER =================

let member = null;

if (loggedInMember) {

    if (typeof loggedInMember === "object") {

        member = members.find(function (item) {

            return (
                (loggedInMember.id != null &&
                    String(item.id) === String(loggedInMember.id)) ||

                (loggedInMember.memberId != null &&
                    String(item.id) === String(loggedInMember.memberId)) ||

                (loggedInMember.email &&
                    item.email === loggedInMember.email)
            );

        });

    } else {

        member = members.find(function (item) {

            return (
                String(item.id) === String(loggedInMember) ||
                item.email === loggedInMember
            );

        });

    }

}


// ================= HELPER FUNCTIONS =================

function showValue(value) {

    return value !== undefined && value !== null && value !== ""
        ? value
        : "Not Available";

}

function formatDate(date) {

    if (!date) {
        return "--";
    }

    // YYYY-MM-DD ko local date ki tarah parse karna
    const parts = String(date).split("-");

    if (
        parts.length === 3 &&
        parts[0].length === 4 &&
        parts.every(part => /^\d+$/.test(part))
    ) {

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        const parsedDate = new Date(year, month - 1, day);

        if (
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day
        ) {

            return parsedDate.toLocaleDateString();

        }

    }

    return date;

}

function createCell(value) {

    const cell = document.createElement("td");

    cell.textContent = showValue(value);

    return cell;

}

function getMemberId(record) {

    return record.memberId ?? record.memberID ?? record.member_id;

}


// ================= SHOW MEMBER NAME =================

if (member) {

    memberName.textContent = member.name || "Member";

} else {

    memberName.textContent = "Member Not Found";

}


// ================= MEMBERSHIP DETAILS =================

function loadMembershipDetails() {

    if (!member) {

        membershipType.textContent = "Not Available";
        membershipDuration.textContent = "Not Available";
        joiningDate.textContent = "Not Available";
        membershipExpiry.textContent = "Not Available";
        membershipStatus.textContent = "Not Available";

        return;
    }

    membershipType.textContent =
        showValue(member.membership);

    membershipDuration.textContent =
        showValue(member.duration);

    joiningDate.textContent =
        formatDate(member.joinDate);

    membershipExpiry.textContent =
        formatDate(member.expiryDate);

    // Saved status use karo; warna expiry date se calculate karo
    if (member.status) {

        membershipStatus.textContent = member.status;

    } else if (member.expiryDate) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiryParts = String(member.expiryDate).split("-");

        const expiry = expiryParts.length === 3
            ? new Date(
                Number(expiryParts[0]),
                Number(expiryParts[1]) - 1,
                Number(expiryParts[2])
            )
            : new Date(member.expiryDate);

        expiry.setHours(0, 0, 0, 0);

        membershipStatus.textContent =
            !Number.isNaN(expiry.getTime()) && expiry >= today
                ? "Active"
                : "Expired";

    } else {

        membershipStatus.textContent = "Not Available";

    }

}


// ================= GET MEMBER ATTENDANCE =================

function getMyAttendance() {

    if (!member) {
        return [];
    }

    return attendance.filter(function (record) {

        return String(getMemberId(record)) === String(member.id);

    });

}


// ================= ATTENDANCE SUMMARY =================

function loadAttendanceSummary() {

    const myAttendance = getMyAttendance();

    const presentRecords = myAttendance.filter(function (record) {

        return String(record.status).toLowerCase() === "present";

    });

    const absentRecords = myAttendance.filter(function (record) {

        return String(record.status).toLowerCase() === "absent";

    });

    // Present records ki tadaad
    totalAttendance.textContent = presentRecords.length;

    // Sirf explicitly Absent marked records count honge
    absentDays.textContent = absentRecords.length;

}


// ================= SHOW ATTENDANCE TABLE =================

function displayAttendance() {

    attendanceTableBody.replaceChildren();

    if (!member) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "Please log in to view your attendance.";

        row.appendChild(cell);
        attendanceTableBody.appendChild(row);

        return;
    }

    const selectedDate = attendanceDateFilter.value;
    const selectedStatus = attendanceStatusFilter.value;

    // Current member ke records
    let myAttendance = getMyAttendance();

    // Date filter
    if (selectedDate) {

        myAttendance = myAttendance.filter(function (record) {

            return String(record.date || "").slice(0, 10) === selectedDate;

        });

    }

    // Status filter
    if (selectedStatus !== "all") {

        myAttendance = myAttendance.filter(function (record) {

            return String(record.status).toLowerCase() ===
                selectedStatus.toLowerCase();

        });

    }

    // Latest date first
    myAttendance.sort(function (a, b) {

        return String(b.date || "").localeCompare(String(a.date || ""));

    });

    if (myAttendance.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "No attendance records found.";

        row.appendChild(cell);
        attendanceTableBody.appendChild(row);

        return;
    }

    myAttendance.forEach(function (record, index) {

        const row = document.createElement("tr");

        row.appendChild(createCell(index + 1));
        row.appendChild(createCell(formatDate(record.date)));
        row.appendChild(createCell(record.checkIn || "--"));
        row.appendChild(createCell(record.checkOut || "--"));
        row.appendChild(createCell(record.status || "--"));

        attendanceTableBody.appendChild(row);

    });

}


// ================= GET MEMBER PAYMENTS =================

function getMyPayments() {

    if (!member) {
        return [];
    }

    return payments.filter(function (payment) {

        return String(getMemberId(payment)) === String(member.id);

    });

}


// ================= PAYMENT SUMMARY =================

function loadPaymentSummary() {

    const myPayments = getMyPayments();

    // Explicitly unpaid/pending/failed records ko paid total mein
    // shamil nahi karna. Purane saved payment records ka status
    // agar missing ho, to unhein paid maana ja raha hai.
    const paidPayments = myPayments.filter(function (payment) {

        const status = String(payment.status || "Paid").toLowerCase();

        return status === "paid";

    });

    const amount = paidPayments.reduce(function (total, payment) {

        const value = Number(
            String(payment.amount ?? 0).replace(/,/g, "")
        );

        return total + (
            Number.isFinite(value) ? value : 0
        );

    }, 0);

    totalPaid.textContent = "Rs. " + amount.toLocaleString();

}


// ================= SHOW PAYMENT HISTORY =================

function displayPayments() {

    paymentTableBody.replaceChildren();

    if (!member) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "Please log in to view your payments.";

        row.appendChild(cell);
        paymentTableBody.appendChild(row);

        return;
    }

    const myPayments = getMyPayments();

    // Latest payment first
    myPayments.sort(function (a, b) {

        return String(b.date || "").localeCompare(String(a.date || ""));

    });

    if (myPayments.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "No payment records found.";

        row.appendChild(cell);
        paymentTableBody.appendChild(row);

        return;
    }

    myPayments.forEach(function (payment, index) {

        const row = document.createElement("tr");

        row.appendChild(createCell(index + 1));
        row.appendChild(createCell(formatDate(payment.date)));

        row.appendChild(
            createCell(
                payment.amount != null
                    ? "Rs. " + payment.amount
                    : "--"
            )
        );

        row.appendChild(
            createCell(payment.method || payment.paymentMethod || "--")
        );

        row.appendChild(
            createCell(payment.status || "Paid")
        );

        paymentTableBody.appendChild(row);

    });

}


// ================= ATTENDANCE FILTER EVENTS =================

attendanceDateFilter.addEventListener("change", displayAttendance);

attendanceStatusFilter.addEventListener("change", displayAttendance);


// ================= LOAD ALL PAGE DATA =================

loadMembershipDetails();

loadAttendanceSummary();

displayAttendance();

loadPaymentSummary();

displayPayments();


// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function (event) {

    event.preventDefault();

    localStorage.removeItem("loggedInMember");

    window.location.href = "../../index.html";

});
