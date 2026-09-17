const sidebarToggle=document.getElementById("sidebarToggle");
const sidebar=document.querySelector(".sidebar");
const sidebarlogo=document.querySelector(".sidebar-logo");
sidebarToggle.addEventListener("click",function(){
    sidebar.classList.toggle("collapsed");
    sidebarlogo.classList.toggle("collapsed");
})

const totalMembers=document.getElementById("totalMembers");
const expiredmembers=document.getElementById("expiredMembers");
const activemembers=document.getElementById("activeMembers");
const totalTrainers=document.getElementById("totalTrainers");
const totalAttendance=document.getElementById("totalAttendance");
const pendingPayments=document.getElementById("pendingPayments");

const trainers=[];
totalTrainers.textContent=trainers.length;
const members=[];
totalMembers.textContent=members.length;
const expiredMembers=[];
const activeMembers=[];
const attendance=[];
const payments=[];

expiredMembers.textContent=expiredMembers.length;
activeMembers.textContent=activeMembers.length;
totalAttendance.textContent=attendance.length;
pendingPayments.textContent=payments.length;

const recentActivities=document.getElementById("recentActivities");
const activities=[];

