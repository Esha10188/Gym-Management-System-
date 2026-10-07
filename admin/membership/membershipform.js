const membershipName = document.getElementById("membershipName");
const membershipDuration = document.getElementById("membershipDuration");
const membershipPrice = document.getElementById("membershipPrice");
const membershipDiscount = document.getElementById("membershipDiscount");
const personalTrainer = document.getElementById("personalTrainer");
const memberLimit = document.getElementById("memberLimit");
const popularPlan = document.getElementById("popularPlan");
const membershipStatus = document.getElementById("membershipStatus");
const membershipFeatures = document.getElementById("membershipFeatures");

const saveMembership = document.getElementById("saveMembership");
const cancelMembership = document.getElementById("cancelMembership");


let memberships = JSON.parse(localStorage.getItem("memberships")) || [];

const editMembershipId = localStorage.getItem("editMembershipId");


// ================= EDIT MODE =================

if (editMembershipId) {

    const membership = memberships.find(function(membership) {
        return membership.id === editMembershipId;
    });

    if (membership) {

        membershipName.value = membership.name;
        membershipDuration.value = membership.duration;
        membershipPrice.value = membership.price;
        membershipDiscount.value = membership.discount;
        personalTrainer.value = membership.trainer;
        memberLimit.value = membership.memberLimit;
        popularPlan.value = membership.popular;
        membershipStatus.value = membership.status;
        membershipFeatures.value = membership.features;

    }
}


// ================= SAVE MEMBERSHIP =================

saveMembership.addEventListener("click", function() {

    // Check all required fields

    if (
        membershipName.value.trim() === "" ||
        membershipDuration.value === "" ||
        membershipPrice.value === "" ||
        membershipDiscount.value === "" ||
        personalTrainer.value === "" ||
        memberLimit.value === "" ||
        membershipStatus.value === "" ||
        membershipFeatures.value.trim() === ""
    ) {

        alert("Please fill all fields.");
        return;
    }


    // ================= CALCULATE FINAL PRICE =================

    const price = Number(membershipPrice.value);
    const discount = Number(membershipDiscount.value);

    const finalPrice = price - (price * discount / 100);


    // ================= EDIT EXISTING MEMBERSHIP =================

    if (editMembershipId) {

        const membershipIndex = memberships.findIndex(function(membership) {
            return membership.id === editMembershipId;
        });


        if (membershipIndex !== -1) {

            memberships[membershipIndex].name = membershipName.value.trim();
            memberships[membershipIndex].duration = membershipDuration.value;
            memberships[membershipIndex].price = price;
            memberships[membershipIndex].discount = discount;
            memberships[membershipIndex].finalPrice = finalPrice;
            memberships[membershipIndex].trainer = personalTrainer.value;
            memberships[membershipIndex].memberLimit = memberLimit.value;
            memberships[membershipIndex].popular = popularPlan.value;
            memberships[membershipIndex].status = membershipStatus.value;
            memberships[membershipIndex].features = membershipFeatures.value.trim();


            localStorage.setItem(
                "memberships",
                JSON.stringify(memberships)
            );


            localStorage.removeItem("editMembershipId");


            alert("Membership updated successfully!");


            window.location.href = "memberships.html";

        }

        return;
    }


    // ================= ADD NEW MEMBERSHIP =================

    const newMembership = {

        id: "MS" + String(memberships.length + 1).padStart(3, "0"),

        name: membershipName.value.trim(),

        duration: membershipDuration.value,

        price: price,

        discount: discount,

        finalPrice: finalPrice,

        trainer: personalTrainer.value,

        memberLimit: memberLimit.value,

        popular: popularPlan.value,

        status: membershipStatus.value,

        features: membershipFeatures.value.trim()

    };


    memberships.push(newMembership);


    localStorage.setItem(
        "memberships",
        JSON.stringify(memberships)
    );


    alert("Membership added successfully!");


    window.location.href = "memberships.html";

});


// ================= CANCEL =================

cancelMembership.addEventListener("click", function() {

    localStorage.removeItem("editMembershipId");

    window.location.href = "memberships.html";

});