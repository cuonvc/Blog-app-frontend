// alert("Page admin nên không css kỹ + responsive");

window.onload = function() {
    var modalForm = document.querySelector(".modal");
    
    var closeModalBtn = document.querySelector(".modal_close_submit");
    
    var createItemForms = document.querySelectorAll(".body-create_form");
    
    var removeBtns = document.querySelectorAll(".remove-btn");
    
    for(var i = 0; i < removeBtns.length; i++) {
        removeBtns[i].addEventListener("click", function() {
            modalForm.style.display = "block";
        });
    }
    
    closeModalBtn.addEventListener("click", function() {
        modalForm.style.display = "none";
    })
}