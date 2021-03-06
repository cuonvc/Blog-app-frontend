// select categories

var categoryAvailableList = document.querySelectorAll(".option-category_item");

const ulCategoriesAvailable = document.querySelector(".option-categories_available");
const ulCategoriesSelect = document.querySelector(".option-categories_select");
    

for (let i = 0; i < categoryAvailableList.length; i++) {
    categoryAvailableList[i].addEventListener("click", function() {
        ulCategoriesSelect.appendChild(categoryAvailableList[i]);
        
        var itemSelected = ulCategoriesSelect
            .children[ulCategoriesSelect.childElementCount - 1];
        
        itemSelected.classList.add("selected");


        var categorySelectedList = document.querySelectorAll(".selected");
    
        for (let j = 0; j < categorySelectedList.length; j++) {
            categorySelectedList[j].addEventListener("click", function() {
                ulCategoriesAvailable.appendChild(categorySelectedList[j]);
        
                var item = ulCategoriesAvailable
                    .children[ulCategoriesAvailable.childElementCount - 1];
        
                item.classList.remove("selected");
            });
        }
    });
}


var modalOptionBtn = document.querySelector(".body-option_btn");
var modalCancelBtn = document.querySelector(".content-cancel_btn");

modalOptionBtn.addEventListener("click", function() {
    document.querySelector("#modal-option").style.display = "flex";
    
});

modalCancelBtn.addEventListener("click", function() {
    document.querySelector("#modal-option").style.display = "none";
});


// display file image when click input file
// link to backend
const imageInput = document.querySelector("#img-background_file");
var uploadImage = "";

imageInput.addEventListener("change", () => {
    console.log(imageInput.value);
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
        uploadImage = fileReader.result;
        document.querySelector("#image-background_display")
            .style.backgroundImage = `url(${uploadImage})`;
    });

    fileReader.readAsDataURL(this.files[0]);
});