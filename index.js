const login=document.getElementById("loginbtn");
login.addEventListener("click", function(){
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    const role=document.getElementById("role").value;
    if(username==="admin" && password==="12345" &&role==="Admin"){
        alert("Login Successful");
        window.location.href="admin/dashboard/admin.html";
    } else {
        alert("Invalid credentials");
    }


})