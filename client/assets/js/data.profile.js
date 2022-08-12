function parseJwt(token) {
    if (!token) { 
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const idUrl = window.location.hash;
let idPost = idUrl.substring(1);
const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

getProfile();

function getProfile() {
    fetch(`http://localhost:8080/api/v1/profile/${username}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.title = `${data.firstName} ${data.lastName}`;

        renderHeader(data);
        renderContent(data);
        // render header
        


    });
}

function renderHeader(data) {
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
            <li class="navbar-logout logout_btn-post row no-gutters">
                <span class="navbar-logo_btn">Đăng xuất</span>
                <i class="fa-solid fa-right-from-bracket"></i>
            </li>
        </ul>
    `
    userBox.innerHTML = userContent;
    logoutAccount(document.querySelector(".logout_btn-post"));
}

// hàm này ghép nối không theo khối (div) do lúc cắt html không chú ý nên nhìn code có hơi sida :D
function renderContent(data) {

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
                <div class="body-profile_detail col l-4 m-12">
                    <div class="body-profile_avt">
                        <img class="profile-avt_link" src="${data.avatarPhoto}" alt="avt">
                        <label class="select-file_avt" for="img-avt_file">
                            <span>Edit</span>
                            <i class="fa-solid fa-pen-to-square"></i>
                        </label>
                        <input type="file" name="img" id="img-avt_file" accept="image/png, image/jpg">
                    </div>
                    <div class="body-profile_name">
                        <h1 class="profile-name_text">${data.firstName} ${data.lastName}</h1>
                    </div>
                    <div class="body-profile_about">
                        <p class="profile-about_text">${data.about}</p>
                    </div>
                    <div class="body-profile_edit">
                        <a href="#" class="profile-edit_btn">Chỉnh sửa</a>
                    </div>
                </div>
                <div class="content_my-posts col l-8 m-12">
                    <div class="content_list-posts">
                `

                fetch("http://localhost:8080/api/v1/posts?pageNo=0&pageSize=100&sortBy=id&sortDir=desc")
                .then(response => {
                    return response.json();
                }).then(posts => {
                    var allPosts = posts.content;
                    let bodyPosts = "";
                    allPosts.map(post => {
                        if (post.userProfile.id === data.id) {
                            let postContent = `
                        <div class="row">
                            <div class="l-12 col">
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
                                            <a href="#" class="my-post_auth">
                                                <img src="${post.userProfile.avatarPhoto}" alt="Avartar">
                                                <span>${post.userProfile.firstName} ${post.userProfile.lastName}</span>
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

                    })
                    console.log(bodyPosts);
                const divTail = `
                </div>
                </div>
                </div>
                </div>
                `
                const bodyContent = bodyInfo + bodyPosts + divTail;
                document.querySelector("#app-body").innerHTML = bodyContent;
                })
                
}

function logoutAccount(logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "../guest/index.html";
    });
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function checkAuth(idBy, item) {
    fetch(`http://localhost:8080/api/v1/profile/${username}`)
    .then(response => {
        return response.json();
    })
    .then(user => {
        if(user.id === idBy) {
            item.style.display = "block";
        }
    })
}