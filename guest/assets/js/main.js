// form login and register event   (only the guest page)

var modalForm = document.querySelector(".modal");
var modalFormContainer = document.querySelector(".js-modal_container");
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
var loginBtnComment = document.querySelector(".comment-form-submit-btn");
var registerBtnSlider = document.querySelector(".slider-signin");
var registerBtnNav = document.querySelector(".navbar-signup_btn");

registerBtnNav.onclick = function() {
    modalForm.style.display = "flex";
    login.style.display = "none";
    forgetPass.style.display = "none";
    register.style.display = "block";
}

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

loginBtnComment.onclick = function() {
    modalForm.style.display = "flex";
    register.style.display = "none";
    forgetPass.style.display = "none";
    login.style.display = "block";
}

//hidden form when click outside form
modalFormContainer.onclick = function(event) {
    event.stopPropagation();
}

modalForm.onclick = function() {
    modalForm.style.display = "none";
}

registerBtnSlider.onclick = function() {
    modalForm.style.display = "flex";
    register.style.display = "block";
    forgetPass.style.display = "none";
    login.style.display = "none";
}

loginBtnEndPage.onclick = function() {
    modalForm.style.display = "flex";
    register.style.display = "none";
    forgetPass.style.display = "none";
    login.style.display = "block";
}

// registerBtnNav.onclick = function() {
//     modalForm.style.display = "flex";
//     login.style.display = "none";
//     forgetPass.style.display = "none";
//     register.style.display = "block";
// }


// //hidden form when click outside form
// modalFormContainer.onclick = function(event) {
//     event.stopPropagation();
// }

// modalForm.onclick = function() {
//     modalForm.style.display = "none";
// }


