// alert("Page admin nên không css kỹ + responsive");

var modalForm = document.querySelector(".modal");

var closeModalBtn = document.querySelector(".modal_close_submit");

var createItemForms = document.querySelectorAll(".body-create_form");

var toLogout = document.querySelector(".navbar-auth_link");
var logoutBtn = document.querySelector(".navbar-auth_logout");
var removeBtns = document.querySelectorAll(".remove-btn");


toLogout.addEventListener("click", function() {
    logoutBtn.classList.toggle("hidden-element");
});

function displayForm() {
    for(var i = 0; i < createItemForms.length; i++) {
        createItemForms[i].style.display = "block";
    }
}

for(var i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener("click", function() {
        modalForm.style.display = "block";
    });
}

closeModalBtn.addEventListener("click", function() {
    modalForm.style.display = "none";
})