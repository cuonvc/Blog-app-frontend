// console.log(localStorage.getItem("accessToken"));

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

const username = parseJwt(localStorage.getItem("accessToken")).Email;  //get username from token
const isActive = parseJwt(localStorage.getItem("accessToken")).IsActive;

if (isActive == "False") {
    alert("Bạn chưa kích hoạt tài khoản, kiểm tra Email spam để lấy mã kích hoạt");
    window.location.href = "active-account.html";
}

// var urlString = window.location.href;
// var urlObj = new URL(urlString);
// var username = urlObj.searchParams.get("u");  //get username from param

renderHeaderInfo();
renderCategories();
renderPostsPin();
searchPosts();


function renderHeaderInfo() {
    fetch(`https://localhost:44377/api/user/${username}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {
        const data = object.data;
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

function renderCategories() {
    fetch('https://localhost:44377/api/category/all')
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {
        const categories = object.data;
        let htmls = "";
        categories.map(category => {
            let html = `
            <li class="content-category_item">
                <a onclick="alertNoti()" href="#" class="content-category_link">${category.name}</a>
            </li>
            `
            htmls += html;
        });

        document.querySelector(".content-category_list").innerHTML = htmls;
    });
}

function alertNoti() {
    alert("Làm lâu quá nên nản bỏ chức năng này :D")
}

function renderPostsPin() {
    fetch('https://localhost:44377/api/post/all?pageNumber=1&pageSize=100')
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {
        const posts = object.data;
        console.log(posts);
        let htmls = "";
        let arrPosts = posts;
        let arrPostsPin = [];
        arrPosts.map(post => {
            if (post.pined === true) {
                arrPostsPin.push(post);
            }
        });
    
        arrPostsPin.forEach(post => {
            console.log(post);
            var firstCategory = post.categories[0];
            var finalDate = formatDate(post.createdDate);
            let html =
                `
                <div class="row">
                    <div class="post-pin l-9 m-12 s-12 col">
                        <div class="content-post_pin row post" id="${post.id}">
                            <a style="cursor: pointer" href="./post.html#${post.id}/${post.title}" class="l-4 m-4 s-4">
                                <div class="post-pin_image" style="background-image: url(${post.thumbnail});">
                                </div>
                            </a>
    
                            <div class="post-pin_text l-8 m-8 s-8">
                                <div class="content-post_categories" style="display: flex; justify-content: space-between;">
                                    <a href="#" class="content-post_category">${firstCategory.name}</a>
                                    <span>${post.view} <i class="fa-sharp fa-regular fa-eye"></i></span>
                                </div>
                                <div class="post-pin_title">
                                    <a style="cursor: pointer" href="./post.html#${post.id}" class="post-pin_link">
                                        <p>${post.title}</p>
                                    </a>
                                </div>
                                <div class="post-pin_description">
                                    <p>${post.description}</p>
                                </div>
                                <div class="post-pin_info">
                                    <a href="./user.html#${post.user.email}" class="post-pin_auth">
                                        <img src="${post.user.avatarPhoto}" alt="Avartar">
                                        <span>
                                            ${post.user.firstName} ${post.user.lastName}
                                            <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                                        </span>
                                    </a>
                                    <div class="post-pin_time">
                                        <i class="fa-solid fa-clock"></i>
                                        <span>${finalDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            htmls += html;
        });
    
        let contentBox = document.querySelector(".content-posts_pin");
        contentBox.innerHTML = htmls;
        let confirmIcons = contentBox.querySelectorAll(".icon_admin-name");
        validateAdmin(arrPostsPin, confirmIcons);
    })
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function logoutAccount(logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "../guest/index.html";
    });
}

function validateAdmin(listPost, icons) {
    for (let i = 0; i < listPost.length; i++) {
        if (listPost[i].user.role === "ADMIN_ROLE" || listPost[i].user.role === "MOD_ROLE") {
            icons[i].style.display = "inline";
        }
    }
}

function checkRole(user, navBox, toAdminBtn) {
    if (user.role === "ADMIN_ROLE" || user.role === "MOD_ROLE") {
        navBox.style.height = "150px";
        toAdminBtn.style.display = "block";
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