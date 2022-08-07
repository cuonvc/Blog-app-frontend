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
renderPostsNew();

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
                    <a href="#" class="navbar-user_link">Thông tin tài khoản</a>
                </li>
                <li class="navbar-user_posts">
                    <a href="#" class="navbar-user_post-link">Bài viết của bạn</a>
                </li>
                <li class="navbar-logout logout_btn row no-gutters">
                    <span class="navbar-logo_btn">Đăng xuất</span>
                    <i class="fa-solid fa-right-from-bracket"></i>
                </li>
            </ul>
        `
        userBox.innerHTML = userContent;
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
                <a href="#" class="content-category_link">${category.name}</a>
            </li>
            `
            htmls += html;
        });

        document.querySelector(".content-category_list").innerHTML = htmls;
    });
}

function renderPostsPin() {
    fetch('http://localhost:8080/api/v1/posts?pageNo=0&pageSize=5')
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
                            <a style="cursor: pointer" onclick="saveIdLocalStorage(${post.id})" class="l-4 m-4 s-4">
                                <div class="post-pin_image" style="background-image: url(${post.thumbnails});">
                                </div>
                            </a>
    
                            <div class="post-pin_text l-8 m-8 s-8">
                                <div class="post-pin_categories">
                                    <a href="#" class="post-pin_category">${firstCategory.name}</a>
                                </div>
                                <div class="post-pin_title">
                                    <a href="./post.html" class="post-pin_link">
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

function renderPostsNew() {
    fetch('http://localhost:8080/api/v1/posts?pageNo=0&pageSize=5')
    .then(function(response) {
        return response.json();
    })
    .then(function(posts) {
        console.log(posts);
        let htmls = "";
        let arrPosts = posts.content;

        arrPosts.forEach(post => {
            var firstCategory = post.categories[0];
            var finalDate = formatDate(post.createdDate);
            let html = `
                <div class="col l-3 m-4 s-12">
                    <div class="content-post_new">
                        <a style="cursor: pointer" onclick="saveIdLocalStorage(${post.id})" class="post-link content-post_link">
                            <div class="content-post_image" style="background-image: url(${post.thumbnails});">
                            </div>
                        </a>
                        
                        <div class="content-post_text">
                            <div class="content-post_categories">
                                <a href="#" class="content-post_category">${firstCategory.name}</a>
                            </div>
                            <div class="content-post_title">
                                <a href="./post.html" class="post-link content-post_link">${post.title}</a>
                            </div>
                            <div class="content-post_description">
                                <p>${post.description}</p>
                            </div>
                            <div class="content-post_info">
                                <a href="#" class="content-post_auth">
                                    <img src="${post.userProfile.avatarPhoto}" alt="Avartar">
                                    <span>${post.userProfile.firstName} ${post.userProfile.lastName}</span>
                                </a>
                                <div class="content-post_time">
                                    <i class="fa-solid fa-clock"></i>
                                    <span>${finalDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            htmls += html;
        });

        var pageNo = 

        document.querySelector(".content-posts").innerHTML = htmls;

        document.querySelector(".pagination")
    });
}

function renderPagingPosts() {
    
}

function saveIdLocalStorage(id) {
    localStorage.setItem("postID", id);
    setTimeout(() => {
        location.href = `/client/post.html`;
    }, 100);
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}