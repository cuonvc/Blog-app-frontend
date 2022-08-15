// console.log(localStorage.getItem("accessToken"));

function parseJwt(token) {
    if (!token) { 
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

// var urlString = window.location.href;
// var urlObj = new URL(urlString);
// var username = urlObj.searchParams.get("u");  //get username from param

renderHeaderInfo();
renderCategories();
renderPostsPin();
searchPosts();


function renderHeaderInfo() {
    fetch(`http://localhost:8080/api/v1/profile/${username}`)
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
                    <a href="./myposts.html" class="navbar-user_post-link">Bài viết của bạn</a>
                </li>
                <li class="navbar-logout logout_btn-home row no-gutters">
                    <span class="navbar-logo_btn">Đăng xuất</span>
                    <i class="fa-solid fa-right-from-bracket"></i>
                </li>
            </ul>
        `
        userBox.innerHTML = userContent;

        logoutAccount(document.querySelector(".logout_btn-home"));
    });
}

function renderCategories() {
    fetch('http://localhost:8080/api/v1/categories')
    .then(function(response) {
        return response.json();
    })
    .then(function(categories) {
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
    fetch('http://localhost:8080/api/v1/posts?pageNo=0&pageSize=5&sortBy=id&sortDir=desc')
    .then(function(response) {
        return response.json();
    })
    .then(function(posts) {
    
        let htmls = "";
        let arrPosts = posts.content;
    
        arrPosts.forEach(post => {
            var firstCategory = post.categories[0];
            var finalDate = formatDate(post.createdDate);
            let html =
                `
                <div class="row">
                    <div class="post-pin l-9 m-12 s-12 col">
                        <div class="content-post_pin row post" id="${post.id}">
                            <a style="cursor: pointer" href="./post.html#${post.id}" class="l-4 m-4 s-4">
                                <div class="post-pin_image" style="background-image: url(${post.thumbnails});">
                                </div>
                            </a>
    
                            <div class="post-pin_text l-8 m-8 s-8">
                                <div class="post-pin_categories">
                                    <a href="#" class="post-pin_category">${firstCategory.name}</a>
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
                                    <a href="#" class="post-pin_auth">
                                        <img src="${post.userProfile.avatarPhoto}" alt="Avartar">
                                        <span>${post.userProfile.firstName} ${post.userProfile.lastName}</span>
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