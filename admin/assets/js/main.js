var toLogout = document.querySelector(".navbar-auth_link");
var logoutBtn = document.querySelector(".navbar-auth_logout");

toLogout.addEventListener("click", function() {
    logoutBtn.classList.toggle("hidden-element");
});