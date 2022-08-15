function parseJwt(token) {
    if (!token) { 
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

var urlString = window.location.href;
var urlObj = new URL(urlString);
var keyword = urlObj.searchParams.get("search");  //get keyword from param

const idUrl = window.location.hash;
let idPost = idUrl.substring(1);
const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

renderHeaderInfo();
renderPostsBySearch();
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
                <li class="navbar-logout logout_btn-post row no-gutters">
                    <span class="navbar-logo_btn">Đăng xuất</span>
                    <i class="fa-solid fa-right-from-bracket"></i>
                </li>
            </ul>
        `
        userBox.innerHTML = userContent;
        logoutAccount(document.querySelector(".logout_btn-post"));
    });
}

function renderPostsBySearch() {
    fetch(`http://localhost:8080/api/v1/posts/search?keyword=${keyword}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(posts) {

        document.querySelector(".search_heading").innerHTML 
            = `<h1 class="search_title">Kết quả tìm kiếm cho "${keyword}"</h1>`;
    
        let htmls = "";
        let arrPosts = posts.content;
    
        arrPosts.forEach(post => {
            var firstCategory = post.categories[0].name;
            var finalDate = formatDate(post.createdDate);
            let html =
                `
                <div class="row">
                    <div class="l-9 m-12 s-12 col">
                        <div class="content-post_by-search row">
                            <a href="./post.html#${idPost}" class="l-4 m-4 s-4">
                                <div class="post_by-search_image" style="background-image: url(${post.thumbnails});">
                                </div>
                            </a>

                            <div class="post_by-search_text l-8 m-8 s-8">
                                <div class="post_categories">
                                    <a href="#" class="post_category">${firstCategory}</a>
                                </div>
                                <div class="post_by-search_title">
                                    <a href="./post.html#${idPost}" class="post_by-search_link">
                                        <p>${post.title}</p>
                                    </a>
                                </div>
                                <div class="post_by-search_description">
                                    <p>${post.description}</p>
                                </div>
                                <div class="post_by-search_info">
                                    <a href="#" class="post_by-search_auth">
                                        <img src="${post.userProfile.avatarPhoto}" alt="Avartar">
                                        <span>${post.userProfile.firstName} ${post.userProfile.lastName}</span>
                                    </a>
                                    <div class="post_by-search_time">
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
    
        let contentBox = document.querySelector(".content-posts_by-search");
        contentBox.innerHTML = htmls;
    })
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function logoutAccount(logoutBtn) {
    console.log(logoutBtn);
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