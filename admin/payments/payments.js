const addPaymentBtn = document.getElementById("addPaymentBtn");
const paymentForm = document.getElementById("paymentForm");
const cancelBtn = document.querySelector(".cancel-btn");


// ================= OPEN PAYMENT FORM =================

addPaymentBtn.addEventListener("click", function () {

    paymentForm.style.display = "block";

})


// ================= CLOSE PAYMENT FORM =================

cancelBtn.addEventListener("click", function () {

    paymentForm.style.display = "none";

})
// ================= MEMBER ID LOGIC =================

const memberIDInput = document.getElementById("memberID");
const membershipSelect = document.getElementById("membership");

// Members localStorage se lena
let members = JSON.parse(localStorage.getItem("members")) || [];

// Member ID enter karne par member find hoga
memberIDInput.addEventListener("input", function () {

    const enteredID = memberIDInput.value.trim();

    // Agar input empty hai
    if (enteredID === "") {
        membershipSelect.value = "";
        return;
    }

    // Member find karna
    const member = members.find(function (m) {

        const storedID = String(m.id).padStart(3, "0");

        return storedID === enteredID;
    });

    // Agar member mil gaya
    if (member) {

        membershipSelect.value = member.membership;

        console.log("Member Found:", member);
    }
    else {

        membershipSelect.value = "";

        console.log("Member not found");
    }
});
// ================= SAVE PAYMENT =================

const savePaymentBtn = document.querySelector(".save-btn");
const paymentsTableBody = document.getElementById("paymentsTableBody");

savePaymentBtn.addEventListener("click", function () {

    const memberID = memberIDInput.value.trim();
    const membership = membershipSelect.value;
    const amount = document.getElementById("amount").value;
    const method = document.getElementById("method").value;
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    // Member ID check
    if (memberID === "") {
        alert("Please enter Member ID");
        return;
    }

    // Member find karna
    const member = members.find(function (m) {
        return String(m.id).padStart(3, "0") === memberID;
    });

    if (!member) {
        alert("Member not found!");
            paymentForm.reset();
    membershipSelect.value = "";
        return;
    }

    // Payment object
    const payment = {
        memberId: memberID,
        memberName: member.name,
        membership: membership,
        amount: Number(amount),
        method: method,
        date: date,
        status: status
    };

    // Purani payments lena
    let payments = JSON.parse(localStorage.getItem("payments")) || [];

    // New payment add karna
    payments.push(payment);

    // localStorage mein save
    localStorage.setItem("payments", JSON.stringify(payments));

    alert("Payment saved successfully!");

    // Form close
    paymentForm.style.display = "none";

    displayPayments();

});

function displayPayments(memberList) {

    let members = memberList || JSON.parse(localStorage.getItem("members")) || [];
    let payments = JSON.parse(localStorage.getItem("payments")) || [];

    paymentsTableBody.innerHTML = "";

    members.forEach(function (member) {

        const memberID = String(member.id).padStart(3, "0");

        const payment = payments.find(function (p) {
            return p.memberId === memberID;
        });

        const row = document.createElement("tr");

        if (payment) {

            row.innerHTML = `
                <td>${memberID}</td>
                <td>${member.name}</td>
                <td>${member.membership}</td>
                <td>Rs. ${payment.amount}</td>
                <td>${payment.method}</td>
                <td>${payment.date}</td>
                <td>${payment.status}</td>
            `;

        } else {

            row.innerHTML = `
                <td>${memberID}</td>
                <td>${member.name}</td>
                <td>${member.membership}</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>Pending</td>
            `;
        }

        paymentsTableBody.appendChild(row);
    });
}





// ================= ALL FILTERS =================

const searchPayment = document.getElementById("searchPayment");
const paymentStatus = document.getElementById("paymentStatus");
const paymentMethod = document.getElementById("paymentMethod");
const paymentDate = document.getElementById("paymentDate");


function applyFilters() {

    let members = JSON.parse(localStorage.getItem("members")) || [];
    let payments = JSON.parse(localStorage.getItem("payments")) || [];

    const searchValue = searchPayment.value.toLowerCase().trim();
    const selectedStatus = paymentStatus.value;
    const selectedMethod = paymentMethod.value;
    const selectedDate = paymentDate.value;


    const filteredMembers = members.filter(function (member) {

        const memberID = String(member.id).padStart(3, "0");

        // Member ki payment find karo
        const payment = payments.find(function (p) {
            return p.memberId === memberID;
        });


        // ================= SEARCH =================

        const nameMatch = member.name
            .toLowerCase()
            .startsWith(searchValue);


        if (!nameMatch) {
            return false;
        }


        // ================= STATUS =================

        let memberStatus = "pending";

        if (payment) {
            memberStatus = payment.status.toLowerCase();
        }


        if (selectedStatus !== "all" &&
            memberStatus !== selectedStatus) {

            return false;
        }


        // ================= METHOD =================

        if (selectedMethod !== "all") {

            // Pending member ki koi method nahi hai
            if (!payment) {
                return false;
            }

            if (payment.method.toLowerCase() !== selectedMethod) {
                return false;
            }
        }


        // ================= DATE =================

        if (selectedDate !== "") {

            // Pending member ki koi date nahi hai
            if (!payment) {
                return false;
            }

            if (payment.date !== selectedDate) {
                return false;
            }
        }


        return true;

    });


    displayPayments(filteredMembers);
}


// Search
searchPayment.addEventListener("input", applyFilters);

// Status
paymentStatus.addEventListener("change", applyFilters);

// Method
paymentMethod.addEventListener("change", applyFilters);

// Date
paymentDate.addEventListener("change", applyFilters);

// ============== SUMMARY CARDS =================

function updatePaymentSummary() {

    let members = JSON.parse(localStorage.getItem("members")) || [];
    let payments = JSON.parse(localStorage.getItem("payments")) || [];

    // Total Revenue
   let totalRevenue = 0;

const today = new Date();

payments.forEach(function (payment) {

    if (payment.status.toLowerCase() === "paid") {

        const paymentDate = new Date(payment.date);

        const sameMonth = paymentDate.getMonth() === today.getMonth();

        const sameYear = paymentDate.getFullYear() === today.getFullYear();

        if (sameMonth && sameYear) {
            totalRevenue += Number(payment.amount);
        }

    }

});


    // Paid Payments
    let paidPayments = payments.filter(function (payment) {

        return payment.status.toLowerCase() === "paid";

    }).length;


    // Pending Payments
    let pendingPayments = members.length - paidPayments;


    // Show values in cards
    document.getElementById("totalRevenue").textContent =
        "Rs. " + totalRevenue;

    document.getElementById("paidpayments").textContent =
        paidPayments;

    document.getElementById("pendingpayments").textContent =
        pendingPayments;
}

updatePaymentSummary();
displayPayments();