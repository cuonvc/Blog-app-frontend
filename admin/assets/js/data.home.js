function parseJwt(token) {
    if (!token) { 
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token
fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${username}`)
.then(response => response.json())
.then(auth => {
    if (auth.roles[0].name === "ROLE_ADMIN") {
        renderHeader(auth);
        renderPosts();
        renderCategories();
        renderUsers();
    } else {
        alert("Chắc hẳn bạn biết đọc code nên bạn mới có thể vào được đây nhỉ :D\nNhưng chẳng thao tác được gì đâu =))\nHãy trở lại với vai trò của mình đi!");
        window.location.href = "../client/home.html";
    }
});

createCategory();
registerAdminAccout();


function renderHeader(auth) {
    const navbarUserBox = document.querySelector(".navbar-user");
    let html = 
    `<div class="navbar-auth">
        <a href="#" class="navbar-auth_link row no-gutters">
            <div class="navbar-auth-avt">
                <img class="navbar-auth-image" src="${auth.avatarPhoto}" alt="">
            </div>
            <div class="navbar-auth-name">
                <span>${auth.firstName} ${auth.lastName}</span>
            </div> 
        </a>

        <div class="navbar-auth_logout hidden-element">
            <span class="navbar_logout-btn">Đăng xuất</span>
        </div>
    </div>`
    navbarUserBox.innerHTML = html;
    logoutAdmin();
}

function renderPosts() {
    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/posts?pageNo=0&pageSize=100&sortBy=id&sortDir=desc")
    .then(response => response.json())
    .then(result => {
        
        var headerTable = 
        `<tr>
            <th>ID</th>
            <th>Title</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Action</th>
        </tr>`
        
        var arrPosts = result.content;
        var listPosts = "";
        arrPosts.map(post => {
            var itemPost = 
            `<tr class="item-post">
                <td class="post_id">${post.id}</td>
                <td>${post.title}</td>
                <td>${post.userProfile.firstName} ${post.userProfile.lastName}</td>
                <td>${post.categories[0].name}</td>
                <td>
                    <span class="remove-btn post_remove-btn">Xóa</span>
                    <span class="pin-btn">Pin</span>
                </td>
            </tr>`;
            listPosts += itemPost;
        })
        var listItemsBox = document.querySelector(".list-item_posts");
        listItemsBox.innerHTML = headerTable + listPosts;
        deletePost();
        pinPost(listItemsBox, arrPosts);
    })
}

function pinPost(listPostHtml, listPost) {
    var listBtnPin = document.querySelectorAll(".pin-btn");
    var listItem = listPostHtml.querySelectorAll(".item-post");
    
    for (let i = 0; i < listItem.length; i++) {
        if (listPost[i].pinned === true) {
            listBtnPin[i].classList.add("pin-btn_active");
        }

        listBtnPin[i].addEventListener("click", function() {
            var idPost = listPost[i].id;
            listBtnPin[i].classList.toggle("pin-btn_active");  //tạm thời để đó

            var status;
            var btn = listBtnPin[i];
            if (btn.className === "pin-btn pin-btn_active") {
                status = true;
            } else {
                status = false;
            }
            
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
            
            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow"
            };
            console.log(status);
            fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${idPost}/${status}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                alert(result);
            })
            .catch(error => alert("Đã xảy ra lỗi: " + error));
        });
    }
}

function renderCategories() {
    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/categories")
    .then(response => response.json())
    .then(result => {
        var headerTable = 
        `<tr>
            <th>ID</th>
            <th>Tên thể loại</th>
            <th>Action</th>
        </tr>
        `

        var listItems = "";
        result.map(category => {
            var item = 
            `<tr class="item-category">
                <td class="category_id">${category.id}</td>
                <td class="category_name">${category.name}</td>
                <td>
                    <input class="edit_input-category"/>
                    <span class="edit-btn category_edit-btn">Chỉnh sửa</span>
                    <span class="remove-btn category_remove-btn">Xóa</span>
                </td>
            </tr>`
            listItems += item;
        });

        document.querySelector(".list-item_categories").innerHTML = headerTable + listItems;
        modifyCategory();
        deleteCategory();
    })
}

function renderUsers() {
    // render admin
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/profiles/role/4", {
        headers: myHeaders
    })
    .then(response => response.json())
    .then(result => {
        var headerTable = 
        `<tr>
            <th>ID</th>
            <th>Tên người dùng (Admin)</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
        </tr>`

        var listItems = "";
        result.content.map(item => {
            var user = 
            `<tr>
                <td>${item.id}</td>
                <td>${item.firstName} ${item.lastName}</td>
                <td>${item.usernameByUser}</td>
                <td>${item.emailByUser}</td>
                <td>${item.roles[0].name}</td>
                <td>
                    <span onclick="alertFunc()" class="remove-btn">?</span>
                </td>
            </tr>`
            listItems += user;
        });

        document.querySelector(".list-item_admin").innerHTML = headerTable + listItems;
    });

    // render users
    var myHeadersUser = new Headers();
    myHeadersUser.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/profiles/role/14", {
        headers: myHeadersUser
    })
    .then(response => response.json())
    .then(result => {
        var headerTable = 
        `<tr>
            <th>ID</th>
            <th>Tên người dùng (User)</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
        </tr>`

        var listItems = "";
        result.content.map(item => {
            var user = 
            `<tr>
                <td>${item.id}</td>
                <td>${item.firstName} ${item.lastName}</td>
                <td>${item.usernameByUser}</td>
                <td>${item.emailByUser}</td>
                <td>${item.roles[0].name}</td>
                <td>
                    <span onclick="alertFunc()" class="remove-btn">?</span>
                </td>
            </tr>`
            listItems += user;
        });

        document.querySelector(".list-item_user").innerHTML = headerTable + listItems;
    });

}

function alertFunc() {
    alert("Tính năng chưa khả dụng");
}

function logoutAdmin() {
    // var logoutBtn = document.querySelector(".navbar_logout-btn");
    var toLogout = document.querySelector(".navbar-auth_link");
    var logoutBtn = document.querySelector(".navbar-auth_logout");

    toLogout.addEventListener("click", function() {
        logoutBtn.classList.toggle("hidden-element");
    });

    logoutBtn.addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "../guest/index.html";
    });
}

function deletePost() {
    var deleteBtns = document.querySelectorAll(".post_remove-btn");
    var idPostList = document.querySelectorAll(".post_id");

    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener("click", function() {
            var idPost = idPostList[i].innerText;

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            }

            fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${idPost}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload();
            })
            .catch(error => {
                console.log(error);
                alert("Đã có lỗi xảy ra, vui lòng fix ngay!");
            });
        });
    }
}

function createCategory() {

    var createSubmit = document.querySelector(".create-category-submit");
    createSubmit.addEventListener("click", function() {
        var categoryContent = document.querySelector(".create-category").value;
        console.log(categoryContent);
    
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
            "name": categoryContent
        });
    
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        }
    
        fetch("https://nvc-rest-blog.herokuapp.com/api/v1/category", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.message === "Category already exists") {
                alert("Category này đã tồn tại");
            } else {
                alert("Thêm thành công: " + result.name);
                location.reload();
            }
        })
        .catch(error => {
            console.log(error);
            alert("Đã có lỗi xảy ra, vui lòng fix ngay!");
        })
    });
}

function modifyCategory() {
    var oldCategory = document.querySelectorAll(".category_name");
    var oldCategoryId = document.querySelectorAll(".category_id");
    var categoryInput = document.querySelectorAll(".edit_input-category");
    var submitBtn = document.querySelectorAll(".category_edit-btn");

    for (let i = 0; i < oldCategory.length; i++) {
        categoryInput[i].addEventListener("click", function() {
            categoryInput[i].value = oldCategory[i].innerText;
            var cateogryId = oldCategoryId[i].innerText;
            submitBtn[i].addEventListener("click", function() {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "name": categoryInput[i].value
                });

                var requestOptions = {
                    method: "PUT",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/category/${cateogryId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if (result.message === "Category already exists") {
                        alert("Category vẫn chưa được chỉnh sửa!");
                    } else {
                        alert("Chỉnh sửa thành công: " + result.name);
                        location.reload();
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("Đã có lỗi xảy ra, vui lòng fix ngay!");
                });
            });
        });
    }
}

function deleteCategory() {
    var idCategories = document.querySelectorAll(".category_id");
    var removeBtns = document.querySelectorAll(".category_remove-btn");

    // console.log(idCategories[0].innerText);

    for (let i = 0; i < idCategories.length; i++) {
        removeBtns[i].addEventListener("click", function() {
            var idRemove = idCategories[i].innerText;

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/category/${idRemove}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload();
            })
            .catch(error => {
                console.log(error);
                alert("Đã có lỗi xảy ra, vui lòng fix ngay!");
            })
        });
    }
}

function registerAdminAccout() {
    var submitBtn = document.querySelector(".create-admin_btn");

    submitBtn.addEventListener("click", function() {
        var lastName = document.querySelector(".type_last-name");
        var firstName = document.querySelector(".type_first-name");
        var username = document.querySelector(".type_username");
        var email = document.querySelector(".type_email");
        var password = document.querySelector(".type_password");
        var rePassword = document.querySelector(".type_re-password");

        console.log(lastName.value);
        console.log(password.value);
        console.log(rePassword.value);

        if (password.value === rePassword.value) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "firstName": firstName.value,
                "lastName": lastName.value,
                "username": username.value,
                "email": email.value,
                "password": password.value    
            });

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("https://nvc-rest-blog.herokuapp.com/api/v1/auth/admin/signup", requestOptions)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload();
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });

        } else {
            alert("Password không trùng khớp!");
        }
    });
}