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

const hashStr = window.location.hash;
let usernameProfile = hashStr.substring(1);

const usernameToken = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

renderHeaderInfo();
renderContent();
searchPosts();


function renderHeaderInfo() {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${usernameToken}`)
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
                    <a href="./user.html#${usernameToken}" class="navbar-user_post-link">Bài viết của bạn</a>
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

// hàm này ghép nối không theo khối (div) do lúc cắt html không chú ý nên nhìn code có hơi sida :D
function renderContent() {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${usernameProfile}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.title = `${data.firstName} ${data.lastName}`;
        const bodyInfo = `
            <div class="grid wide col">
                <div id="image-background_display" class="body_background" style="background-image: url(${data.coverPhoto});">
                    <label class="select-file_background" for="img-background_file">
                        <span>Edit</span>
                        <i class="fa-solid fa-pen-to-square"></i>
                    </label>
                    <input type="file" id="img-background_file" name="img" accept="image/png, image/jpg">
                </div>
                <div class="body-content row">
                    <div class="body-profile_detail col l-4 m-12 s-12">
                        <div class="body-profile_avt">
                            <img class="profile-avt_link" src="${data.avatarPhoto}" alt="avt">
                            <label class="select-file_avt" for="img-avt_file">
                                <span>Edit</span>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </label>
                            <input type="file" name="img" id="img-avt_file" accept="image/png, image/jpg">
                        </div>
                        <div class="body-profile_name">
                            <h1 class="profile-name_text">
                                <span>
                                    ${data.firstName} ${data.lastName}
                                    <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                                </span>
                            </h1>
                        </div>
                        <div class="body-profile_about">
                            <p class="profile-about_text">${data.about}</p>
                        </div>
                        <div class="body-profile_edit">
                            <a href="./setting.html" class="profile-edit_btn">Chỉnh sửa</a>
                        </div>
                    </div>
                    <div class="content_my-posts col l-8 m-12 s-12">
                        <p class="row my-posts_title">Những bài viết của ${data.firstName} ${data.lastName}</p>
                        <div class="content_list-posts">
                    `;
    
                    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/posts?pageNo=0&pageSize=100&sortBy=id&sortDir=desc")
                    .then(response => {
                        return response.json();
                    }).then(posts => {
                        var allPosts = posts.content;
                        let bodyPosts = "";
                        allPosts.map(post => {
                            if (post.userProfile.id === data.id) {
                                let postContent = `
                            <div class="row">
                                <div class="l-12 col m-12 s-12">
                                    <div class="content_my-post row">
                                        <a href="./post.html#${post.id}" class="l-4 m-4 s-4">
                                            <div class="my-post_image" style="background-image: url(${post.thumbnails});">
                                            </div>
                                        </a>
    
                                        <div class="my-post_text l-8 m-8 s-8">
                                            <div class="post_categories">
                                                <a href="#" class="post_category">${post.categories[0].name}</a>
                                            </div>
                                            <div class="my-post_title">
                                                <a href="./post.html#${post.id}" class="my-post_link">
                                                    <p>${post.title}</p>
                                                </a>
                                            </div>
                                            <div class="my-post_description">
                                                <p>${post.description}</p>
                                            </div>
                                            <div class="my-post_info">
                                                <a href="./user.html#${usernameProfile}" class="my-post_auth">
                                                    <img src="${post.userProfile.avatarPhoto}" alt="Avartar">
                                                    <span>
                                                        ${post.userProfile.firstName} ${post.userProfile.lastName}
                                                        <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                                                    </span>
                                                </a>
                                                <div class="my-post_time">
                                                    <i class="fa-solid fa-clock"></i>
                                                    <span>${formatDate(post.createdDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                                bodyPosts += postContent;
                            }
    
                        });
                    const divTail = `
                    </div>
                    </div>
                    </div>
                    </div>
                    `
                    const bodyContent = bodyInfo + bodyPosts + divTail;
                    document.querySelector("#app-body").innerHTML = bodyContent;

                    var editCoverBtn = document.querySelector(".select-file_background");
                    var editAvtBtn = document.querySelector(".select-file_avt");
                    var editInfoBtn = document.querySelector(".body-profile_edit");
                    checkAuth(data.id, editCoverBtn, editAvtBtn, editInfoBtn);
                    updateAvatar();
                    updateCover();

                    validateAdmin(data, document.querySelector(".body-profile_detail")
                        .querySelector(".icon_admin-name"));
                    var confirmIcons = document.querySelector(".content_my-posts")
                        .querySelectorAll(".icon_admin-name");
                    for (var i = 0; i < allPosts.length; i++) {
                        validateAdmin(allPosts[i].userProfile, confirmIcons[i]);
                    }

                });   
    });
}

function logoutAccount(logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "../guest/index.html";
    });
}

function validateAdmin(obj, icon) {
    console.log(obj);
    console.log(icon);
    if (obj.roles[0].name === "ROLE_ADMIN") {
        icon.style.display = "inline";
    }
}

function checkRole(user, navBox, toAdminBtn) {
    if (user.roles[0].name === "ROLE_ADMIN") {
        navBox.style.height = "150px";
        toAdminBtn.style.display = "block";
    }
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function checkAuth(idBy, item1, item2, item3) {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${usernameToken}`)
    .then(response => {
        return response.json();
    })
    .then(user => {
        if(user.id !== idBy) {
            item1.style.display = "none";
            item2.style.display = "none";
            item3.style.display = "none";
        }
    })
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

// display file image when click input file
// link to backend

function updateAvatar() {
    var apiUpload = "https://nvc-rest-blog.herokuapp.com/api/v1/profile/avatar";
    var imageInput = document.querySelector("#img-avt_file");
    var imageDisplay = document.querySelector(".profile-avt_link");
    // uploadProfileImage(apiUpload, imageInput, imageDisplay);

    var uploadImage = "";

    imageInput.addEventListener("change", () => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            uploadImage = fileReader.result;
            imageDisplay.style.backgroundImage = `url(${uploadImage})`;
        });
        // console.log(imageInput.files[0]);
        // fileReader.readAsDataURL(imageInput.files[0]);
        // console.log(fileReader);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);

        var formdata = new FormData();
        formdata.append("image", imageInput.files[0]);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        fetch(apiUpload, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            // location.reload();
        })
        .catch(error => console.log("error", error));
    });
}

function updateCover() {
    var apiUpload = "https://nvc-rest-blog.herokuapp.com/api/v1/profile/coverPhoto";
    var imageInput = document.querySelector("#img-background_file");
    var imageDisplay = document.querySelector("#image-background_display");
    // uploadProfileImage(apiUpload, imageInput, imageDisplay);

    var uploadImage = "";

    imageInput.addEventListener("change", () => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            uploadImage = fileReader.result;
            imageDisplay.style.backgroundImage = `url(${uploadImage})`;
        });
        // console.log(imageInput.files[0]);
        // fileReader.readAsDataURL(imageInput.files[0]);
        // console.log(fileReader);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);

        var formdata = new FormData();
        formdata.append("image", imageInput.files[0]);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        fetch(apiUpload, requestOptions)
        .then(response => response.text())
        .then(result => {
            location.reload();
        })
        .catch(error => console.log("error", error));
    });
}