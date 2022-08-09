function parseJwt(token) {
    if (!token) { 
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const idPost = localStorage.getItem("postID");
const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

renderHeaderInfo();
renderPostContent();
renderPostComments();


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

function renderPostContent() {
    fetch(`http://localhost:8080/api/v1/post/${idPost}`)
    .then(response => response.json())
    .then(post => {
        let postContent = `
            <div class="body-post_categories">
                <ul class="body-post_category-list">
                    <li class="body-post_cateogry-item"><a href="#">${post.categories[0].name}</a></li>
                </ul>
            </div>
            <div class="body-post_title">
                <h1 class="post_title--text">${post.title}</h1>
            </div>
            <div class="row no-gutters" style="justify-content: space-between;">
                <div class="body-post_auth row no-gutters">
                    <div class="body-post_auth-avt">
                        <a href="#"><img src="${post.userProfile.avatarPhoto}" alt="avt"></a>
                    </div>
                    <div class="body-post_auth-name">
                        <a href="#">${post.userProfile.firstName} ${post.userProfile.lastName}</a>
                        <span>${formatDate(post.createdDate)}</span>
                    </div>
                </div>
                <div class="action action-post" style="display: none;">
                    <i class="action-icon fa-solid fa-ellipsis-vertical"></i>
                    <div class="action-box">
                        <span class="action-item action-delete_post">Xóa bài viết</span>
                        <span class="action-item action-edit_post">Chỉnh sửa</span>
                    </div>
                </div>
            </div>
            <div class="body-post_content">${post.content}</div>
            </div>
        `;

        document.querySelector(".body-post_box").innerHTML = postContent;
        
        document.querySelector("#title-post_client").innerHTML = post.title;
        
        const idUserByPost = post.userProfile.id;
        const item = document.querySelector(".action-post");
        checkAuth(idUserByPost, item);
    })
}

function renderPostComments() {
    fetch(`http://localhost:8080/api/v1/post/${idPost}`)
    .then(response => response.json())
    .then(post => {
        let commentList = "";
        for(var i = 0; i < post.comments.length; i++) {
            let commentItem = `
            <div class="comment-item">
                <div class="row no-gutters" style="justify-content: space-between;">
                    <div class="comment-item_auth row no-gutters">
                        <div class="comment-item_avt">
                            <a href="#">
                                <img src="${post.comments[i].userProfile.avatarPhoto}" alt="avt">
                            </a>
                        </div>
                        <div class="comment-item_info">
                            <a href="#">${post.comments[i].userProfile.firstName} ${post.comments[i].userProfile.lastName}</a>
                            <span class="row no-gutters">
                                <p class="comment-item_info-create">${formatDate(post.comments[i].createdDate)}</p>
                                &nbsp;(Chỉnh sửa:&nbsp;<p class="comment-item_info-modify">${formatDate(post.comments[i].modifiedDate)}</p>)
                            </span>
                        </div>
                    </div>
                    <div id="comment-${post.comments[i].id}" class="action action-comment" style="display: none;">
                        <i class="action-icon fa-solid fa-ellipsis-vertical"></i>
                        <div class="action-box">
                            <span class="action-item action-delete_post">Xóa</span>
                            <span class="action-item action-edit_post">Chỉnh sửa</span>
                        </div>
                    </div>
                </div>
                <div class="comment-item_content">
                    <p>${post.comments[i].content}</p>
                </div>
            </div>
            `
            commentList += commentItem;
        }

        document.querySelector(".comment-list").innerHTML = commentList;

        const commentArr = post.comments;
        for (var i = 0; i < commentArr.length; i++) {
            const item = document.querySelector(`#comment-${commentArr[i].id}`);
            checkAuth(commentArr[i].userProfile.id, item);
        }
    })
}

function logoutAccount(logoutBtn) {
    console.log(logoutBtn);
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