// form login and register event   (only the guest page)

var modalForm = document.querySelector(".modal");
var modalFormContainer = document.querySelector(".js-modal_container");

var toLoginBtns = document.querySelectorAll(".sign_in-btn");
var toRegisterBtns = document.querySelectorAll(".sign_up-btn");
var toForgetPassBtns = document.querySelectorAll(".forget_pass-btn");

var registerForm = document.querySelector(".modal-content_register");
var loginForm = document.querySelector(".modal-content_login");
var forgetPassForm = document.querySelector(".modal-content_forget-pass");
var backToForm = document.querySelectorAll(".modal_back_submit");
var formsClose = document.querySelectorAll(".modal_close_submit");


loopEventClick(toLoginBtns, loginBtn);
loopEventClick(toRegisterBtns, registerBtn);
loopEventClick(toForgetPassBtns, forgetPassBtn);

// check một lượt các btn cùng class xem cái nào đang thực hiện click
function loopEventClick(arrayBtn, btnFunction) {
    for(var i = 0; i < arrayBtn.length; i++) {
        arrayBtn[i].addEventListener("click", btnFunction);
    }
}

function loginBtn() {
    // when click to loginBtn:
    modalForm.style.display = "flex";
    registerForm.style.display = "none";
    forgetPassForm.style.display = "none";
    loginForm.style.display = "block";
}

function registerBtn() {
    // when click to registerBtn:
    modalForm.style.display = "flex";
    loginForm.style.display = "none";
    forgetPassForm.style.display = "none";
    registerForm.style.display = "block";
}

function forgetPassBtn() {
    // when click to forgetPassBtn:
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    forgetPassForm.style.display = "block";
}

// back to login form
for (i = 0; i < backToForm.length; i++) {
    backToForm[i].onclick = function() {
        registerForm.style.display = "none";
        forgetPassForm.style.display = "none";
        loginForm.style.display = "block";
    }
}

// close form login, register or forgetpass
for(i = 0; i < formsClose.length; i++) {
    formsClose[i].onclick = function() {
        modalForm.style.display = "none";
    }
}

//hidden form when click outside form
modalFormContainer.onclick = function(event) {
    event.stopPropagation();
}

modalForm.onclick = function() {
    modalForm.style.display = "none";
}

searchPosts();

function searchPosts() {
    var keyword = document.querySelector(".navbar-search_type");
    var searchSubmit = document.querySelector(".search_icon");
    keyword.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchSubmit.click();
        }
    })
    searchSubmit.addEventListener("click", function() {
        modalForm.style.display = "flex";
        registerForm.style.display = "none";
        forgetPassForm.style.display = "none";
        loginForm.style.display = "block";
    })
}


