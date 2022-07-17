var toRegister = document.querySelector(".modal_to-register");
var toLogin = document.querySelector(".modal_to-login");
var toForgetPass = document.querySelector(".forget_pass__submit");
var register = document.querySelector(".modal-content_register");
var login = document.querySelector(".modal-content_login");
var forgetPass = document.querySelector(".modal-content_forget-pass");
var backToForm = document.querySelectorAll(".modal_back_submit");

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
