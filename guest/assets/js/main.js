// form login and register event

var modalForm = document.querySelector(".modal");
var modalFormContents = document.querySelectorAll(".modal-content");
var toRegister = document.querySelector(".modal_to-register");
var toLogin = document.querySelector(".modal_to-login");
var toForgetPass = document.querySelector(".forget_pass__submit");
var register = document.querySelector(".modal-content_register");
var login = document.querySelector(".modal-content_login");
var forgetPass = document.querySelector(".modal-content_forget-pass");
var backToForm = document.querySelectorAll(".modal_back_submit");
var formsClose = document.querySelectorAll(".modal_close_submit");
var loginBtnNav = document.querySelector(".navbar-signin_btn");
var loginBtnEndPage = document.querySelector(".content-continute_signin");
var registerBtnNav = document.querySelector(".navbar-signup_btn");

toRegister.onclick = function() {
    login.style.display = "none";
    forgetPass.style.display = "none";
    register.style.display = "block";
}

toLogin.onclick = function() {
    register.style.display = "none";
    forgetPass.style.display = "none";
    login.style.display = "block";
}

toForgetPass.onclick = function() {
    login.style.display = "none";
    register.style.display = "none";
    forgetPass.style.display = "block";
}

for (i = 0; i < backToForm.length; i++) {
    backToForm[i].onclick = function() {
        register.style.display = "none";
        forgetPass.style.display = "none";
        login.style.display = "block";
    }
}

for(i = 0; i < formsClose.length; i++) {
    formsClose[i].onclick = function() {
        modalForm.style.display = "none";
    }
}

loginBtnNav.onclick = function() {
    modalForm.style.display = "flex";
    register.style.display = "none";
    forgetPass.style.display = "none";
    login.style.display = "block";
}

loginBtnEndPage.onclick = function() {
    modalForm.style.display = "flex";
    register.style.display = "none";
    forgetPass.style.display = "none";
    login.style.display = "block";
}

registerBtnNav.onclick = function() {
    modalForm.style.display = "flex";
    login.style.display = "none";
    forgetPass.style.display = "none";
    register.style.display = "block";
}


//hidden form when click outside form
modalForm.onclick = function() {
    this.style.display = "none";
}

for(const i = 0; i < modalFormContents.length; i++) {
    modalFormContents[i].addEventListener("click", function(event) {
        event.stopPropagation();
    })
}
