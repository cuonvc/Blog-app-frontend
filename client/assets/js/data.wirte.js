if (localStorage.getItem("accessToken") === null) {
    alert("Bạn chưa đăng nhập, vui lòng đăng nhập để xem nội dung");
    window.location.href = "../guest/index.html";
}

function parseJwt(token) {
    if (!token) { 
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

var urlString = window.location.href;
var urlObj = new URL(urlString);
var idPost = urlObj.searchParams.get("post");  //get keyword from param

renderHeaderInfo();
// renderCategories();
if (idPost === undefined || idPost === null) {
    // window.getContentOldPost = false;
    createPost();
} else {
    // window.createPost = false;
    getContentOldPost(idPost);
}

searchPosts();

function renderHeaderInfo() {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${username}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const userBox = document.querySelector(".navbar-user");
        const userContent = `
            <div class="navbar-user_btn row no-gutters">
                <div class="navbar-user_avt">
                    <img src="${data.avatarPhoto}" alt="avt">
                </div>
                <div class="navbar-user_name">
                    <span>${data.firstName} ${data.lastName}</span>
                </div>
                <div class="navbar-user_icon-down">
                    <i class="fa-solid fa-caret-down"></i>
                </div>
            </div>
            <ul class="navbar-user_box">
                <li class="navbar-user_detail">
                    <a href="./setting.html" class="navbar-user_link">Thông tin tài khoản</a>
                </li>
                <li class="navbar-user_posts">
                    <a href="./user.html#${username}" class="navbar-user_post-link">Bài viết của bạn</a>
                </li>
                <li class="navbar-user_posts to-admin" style="display: none">
                    <a href="../admin/home.html" class="navbar-user_admin-link">Đi tới trang Admin</a>
                </li>
                <li class="navbar-logout logout_btn-home row no-gutters">
                    <span class="navbar-logo_btn">Đăng xuất</span>
                    <i class="fa-solid fa-right-from-bracket"></i>
                </li>
            </ul>
        `
        userBox.innerHTML = userContent;

        var navBox = document.querySelector(".navbar-user_box");
        var toAdminBtn = document.querySelector(".to-admin");
        logoutAccount(document.querySelector(".logout_btn-home"));
        checkRole(data, navBox, toAdminBtn);
    });
}

// function renderCategories() {
//     fetch('https://nvc-rest-blog.herokuapp.com/api/v1/categories')
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(categories) {
//         let htmls = "";
//         categories.map(category => {
//             let html = `<li class="option-category_item">${category.name}</li>`;
//             htmls += html;
//         });

//         document.querySelector(".option-categories_available").innerHTML = htmls;
//     });
// }

function logoutAccount(logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "../guest/index.html";
    });
}

function checkRole(user, navBox, toAdminBtn) {
    if (user.roles[0].name === "ROLE_ADMIN") {
        navBox.style.height = "150px";
        toAdminBtn.style.display = "block";
    }
}

function createPost() {

    fetch('https://nvc-rest-blog.herokuapp.com/api/v1/categories')
        .then(function(response) {
            return response.json();
        })
        .then(function(categories) {
            let htmls = "";
            categories.map(category => {
                let html = `<li class="option-category_item">${category.name}</li>`;
                htmls += html;
            });
            document.querySelector(".option-categories_available").innerHTML = htmls;
            
            
            selectCategories(function() {
                var arrCategId = generateCategoriesId(categories);
                console.log(arrCategId);

                var titleContent = document.querySelector(".body-heading_type").innerText;

                let descriptionContent = "";
                var descriptionElement = document.querySelector(".modal-description_type");
                if (descriptionElement.value !== '') {
                    descriptionContent = descriptionElement.value;
                } else {
                    descriptionContent = document.querySelector(".body-content_editor").childNodes[0].innerText;
                }
                console.log(descriptionElement);

                let textContent = "";
                const children = document.querySelector(".body-content_editor").childNodes;
                console.log(children);
                children.forEach(element => {
                    console.log(typeof(element));
                    if (String(element.getAttribute("class")) === "image ck-widget"
                        || String(element.getAttribute("class")) === "image ck-widget ck-widget_selected"
                        || String(element.getAttribute("class")) === "image ck-widget image-style-side ck-widget_selected") {
                        console.log("Test");
                        console.log(element);
                        var tagImg = element.getElementsByTagName("img")[0];
                        element.remove();
                        textContent += tagImg.outerHTML;
                    } else {

                        textContent += element.outerHTML;
                    }
                    console.log(textContent);
                })


                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify(
                    {
                        "title": titleContent,
                        "description": descriptionContent,
                        "content": textContent
                    }
                )

                // console.log(titleContent);
                // console.log(descriptionContent);
                console.log(textContent);

                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                }


                console.log(`https://nvc-rest-blog.herokuapp.com/api/v1/category/${arrCategId.toString()}/post`);
                var submitBtn = document.querySelector(".content-confirm_btn");
                submitBtn.addEventListener("click", function() {
                    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/category/${arrCategId.toString()}/post`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        var idPost = JSON.parse(result).id;
                        window.location.href = `./post.html#${idPost}`;
                    })
                    .catch(error => console.log("error", error));
                });
            });

        });
}

function generateCategoriesId(categories) {
    var arrCategName = [];
    var categoriesSelected = document.getElementsByClassName("option-category_item selected");
    console.log(categoriesSelected);
    for (let i = 0; i < categoriesSelected.length; i++) {
        arrCategName.push(categoriesSelected[i].innerText);
    }
    console.log(arrCategName);

    var arrCategId = [];
    categories.map(category => {
        for (let i = 0; i < arrCategName.length; i++) {
            if (category.name === arrCategName[i]) {
                arrCategId.push(categories[i].id);
            }
        }
    })
    return arrCategId;
}

function selectCategories(callback) {
    // window.addEventListener("load", function() {
        console.log("test");
        var categoryAvailableList = document.querySelectorAll(".option-category_item");
        
        var ulCategoriesAvailable = document.querySelector(".option-categories_available");
        var ulCategoriesSelect = document.querySelector(".option-categories_select");
    
        // console.log(categoryAvailableList);
        // console.log(categoryAvailableList.length);
        for (let i = 0; i < categoryAvailableList.length; i++) {
            categoryAvailableList[i].addEventListener("click", function() {
                ulCategoriesSelect.appendChild(categoryAvailableList[i]);
                
                var itemSelected = ulCategoriesSelect
                    .children[ulCategoriesSelect.childElementCount - 1];
                
                itemSelected.classList.add("selected");
                callback();
        
                var categorySelectedList = document.querySelectorAll(".selected");
            
                for (let j = 0; j < categorySelectedList.length; j++) {
                    categorySelectedList[j].addEventListener("click", function() {
                        ulCategoriesAvailable.appendChild(categorySelectedList[j]);
                
                        var item = ulCategoriesAvailable
                            .children[ulCategoriesAvailable.childElementCount - 1];
                
                        item.classList.remove("selected");
                        callback();
                    });
                }
            });
        }
    
}

function searchPosts() {
    var keyword = document.querySelector(".navbar-search_type");
    var searchSubmit = document.querySelector(".search_icon");
    var iconToSearchMobile = document.querySelector(".search_icon_mobile");
    if (getComputedStyle(iconToSearchMobile).display === "block") {
        iconToSearchMobile.addEventListener("click", function() {
            searchSubmit.style.display = "block";
            iconToSearchMobile.style.display = "none";
            console.log("test");
            keyword.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    searchSubmit.click();
                }
            });
            searchSubmit.addEventListener("click", function() {
                window.location.href = `./posts-search.html?search=${keyword.value}`;
            });
        });
    } else {
        keyword.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchSubmit.click();
            }
        });
        searchSubmit.addEventListener("click", function() {
            window.location.href = `./posts-search.html?search=${keyword.value}`;
        });
    }

}




function getContentOldPost(id) {

    if (id !== null) {
        var heading = document.querySelector(".body-heading_type");
        var body = document.querySelector(".body-content");
        var description = document.querySelector(".modal-description_type");
        var categoriesSelect = document.querySelector(".option-categories_select");
        // console.log(content);
        fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${id}`)
        .then(response => {
            return response.json();
        })
        .then(result => {
            heading.innerHTML = result.title;
            body.innerHTML = `
            <div class="ck-blurred body-content_editor ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" id="editor" lang="vi" dir="ltr" role="textbox" aria-label="Trình soạn thảo văn bản, main" data-ck-unsafe-attribute-oninput="this.style.height = '28px'; this.style.height = this.scrollHeight +'px'" contenteditable="true">
                ${result.content}
            </div>
            `;
            description.innerHTML = result.description;
    
            var categoryList = result.categories;
            let categoriesHtml = "";
            categoryList.map(category => {
                let html = `<li class="option-category_item selected">${category.name}</li>`;
                categoriesHtml += html;
            })
            categoriesSelect.innerHTML = categoriesHtml;
    
            // selectCategories(function() {
            //     // var arrCategId = generateCategoriesId(categoriesSelect);
            // });
            var continuteBtn = document.querySelector(".body-option_btn");
            continuteBtn.addEventListener("click", function() {
                var titleContent = document.querySelector(".body-heading_type").innerText;
        
                let descriptionContent = "";
                var descriptionElement = document.querySelector(".modal-description_type");
                if (descriptionElement.value !== '') {
                    descriptionContent = descriptionElement.value;
                } else {
                    descriptionContent = document.querySelector(".body-content_editor").childNodes[0].innerText;
                }
                console.log(descriptionElement);
    
                let textContent = "";
                const children1 = document.querySelector(".body-content_editor").childNodes;
                console.log(children1);
                // children1.forEach(element => {
                    for (let i = 1; i < children1.length - 1; i++) {
                        console.log(children1[i]);
                        if (String(children1[i].getAttribute("class")) === "image ck-widget"
                            || String(children1[i].getAttribute("class")) === "image ck-widget ck-widget_selected"
                            || String(children1[i].getAttribute("class")) === "image ck-widget image-style-side ck-widget_selected") {
                            console.log("Test");
                            console.log(children1[i]);
                            var tagImg = children1[i].getElementsByTagName("img")[0];
                            children1[i].remove();
                            textContent += tagImg.outerHTML;
                        } else {
    
                            textContent += children1[i].outerHTML;
                        }
                        console.log(textContent);
                    }
                // })
    
                publishOldPost(titleContent, descriptionContent, textContent, id);

            });
    
        });
    }

}

function publishOldPost(title, description, content, id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    myHeaders.append("Content-Type", "application/json");

    console.log(title);
    console.log(description);
    console.log(content);

    var raw = JSON.stringify({
        "title": title,
        "description": description,
        "content": content,
    });

    var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    document.querySelector(".content-confirm_btn").addEventListener("click", function() {
        fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            window.location.href = `./post.html#${id}`;
        })
        .catch(error => console.log('error', error));
    })
}