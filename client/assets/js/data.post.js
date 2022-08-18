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

const idUrl = window.location.hash;
let idPost = idUrl.substring(1);
const username = parseJwt(localStorage.getItem("accessToken")).sub;  //get username from token

start();
function start() {
    renderHeaderInfo();
    renderPostContent();
    renderPostComments();
}

searchPosts();
commentToPost();


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
                <li class="navbar-logout logout_btn-post row no-gutters">
                    <span class="navbar-logo_btn">Đăng xuất</span>
                    <i class="fa-solid fa-right-from-bracket"></i>
                </li>
            </ul>
        `
        userBox.innerHTML = userContent;

        var navBox = document.querySelector(".navbar-user_box");
        var toAdminBtn = document.querySelector(".to-admin");
        logoutAccount(document.querySelector(".logout_btn-post"));
        checkRole(data, navBox, toAdminBtn);
    });
}

function renderPostContent() {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${idPost}`)
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
                        <a href="./user.html#${post.userProfile.usernameByUser}"><img src="${post.userProfile.avatarPhoto}" alt="avt"></a>
                    </div>
                    <div class="body-post_auth-name">
                        <a href="./user.html#${post.userProfile.usernameByUser}">
                            <span>
                                ${post.userProfile.firstName} ${post.userProfile.lastName}
                                <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                            </span>
                        </a>
                        <span>${formatDate(post.createdDate)}</span>
                    </div>
                </div>
                <div class="action action-post" style="display: none;">
                    <i class="action-icon fa-solid fa-ellipsis-vertical"></i>
                    <div class="action-box action-box_post">
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
        
        const userByPost = post.userProfile;
        const item = document.querySelector(".action-post");
        let confirmIcon = document.querySelector(".body-post_box")
            .querySelector(".icon_admin-name");
        checkAuth(userByPost, item);
        clickToActionPost();
        validateAdmin(post, confirmIcon);
    })
    .catch(() => {
        alert("bài viết không tồn tại!");
        window.location.href = "./home.html";
    })
}

function renderPostComments() {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${idPost}/comments`)
    .then(response => response.json())
    .then(result => {
        let commentList = "";
        for(var i = 0; i < result.length; i++) {
            let commentItem = `
            <div class="comment-item-${result[i].id}">
                <div class="row no-gutters" style="justify-content: space-between;">
                    <div class="comment-item_auth row no-gutters">
                        <div class="comment-item_avt">
                            <a href="./user.html#${result[i].userProfile.usernameByUser}">
                                <img src="${result[i].userProfile.avatarPhoto}" alt="avt">
                            </a>
                        </div>
                        <div class="comment-item_info">
                            <a href="./user.html#${result[i].userProfile.usernameByUser}">
                                <span>
                                    ${result[i].userProfile.firstName} ${result[i].userProfile.lastName}
                                    <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                                </span>
                            </a>
                            <span class="row no-gutters">
                                <p class="comment-item_info-create">${formatDate(result[i].createdDate)}</p>
                                &nbsp;(Chỉnh sửa:&nbsp;<p class="comment-item_info-modify">${formatDate(result[i].modifiedDate)}</p>)
                            </span>
                        </div>
                    </div>
                    <div id="comment-${result[i].id}" class="action action-comment-${result[i].id}" style="display: none;">
                        <i class="action-icon fa-solid fa-ellipsis-vertical"></i>
                        <div class="action-box action-box_comment-${result[i].id}">
                            <span class="action-item action-delete_comment-${result[i].id}">Xóa</span>
                            <span class="action-item action-edit_comment-${result[i].id}">Chỉnh sửa</span>
                        </div>
                    </div>
                </div>
                <div class="comment-item_content">
                    <p>${result[i].content}</p>
                </div>
            </div>
            `
            commentList += commentItem;
        }

        document.querySelector(".comment-list").innerHTML = commentList;
        let confirmIcons = document.querySelector(".comment-list")
            .querySelectorAll(".icon_admin-name");

        for (var i = 0; i < result.length; i++) {
            const item = document.querySelector(`#comment-${result[i].id}`);
            checkAuth(result[i].userProfile, item);
            clickToActionComment(result[i].id, result[i].content);
            validateAdmin(result[i], confirmIcons[i]);
        }
    })
}

function validateAdmin(obj, icon) {
    if (obj.userProfile.roles[0].name === "ROLE_ADMIN") {
        icon.style.display = "inline";
    }
}

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

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function checkAuth(userBy, item) {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${username}`)
    .then(response => {
        return response.json();
    })
    .then(userByToken => {
        if(userByToken.id === userBy.id || userByToken.roles[0].name === "ROLE_ADMIN") {
            item.style.display = "block";
        }
    })
}

function commentToPost() {
    var submitComment = document.querySelector(".comment-submit_new");
    submitComment.addEventListener("click", fetchComment);
}


function fetchComment() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    myHeaders.append("Content-Type", "application/json");

    var content = document.querySelector(".comment-form-type").value;

    var raw = JSON.stringify({
        "content": content
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${idPost}/comment`, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    //clear old content in textbox after submit
    document.querySelector(".comment-form-type").value = '';
    setTimeout(() => {
        location.reload();
    }, 1000);

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

function clickToActionPost() {
    var actionPost = document.querySelector(".action-post");
    actionPost.addEventListener("click", function() {
        document.querySelector(".action-box_post").classList.toggle("show-element");
        modifyPost();
        removePost();
    });
}

function modifyPost() {

    var editBtn = document.querySelector(".action-edit_post");
    editBtn.addEventListener("click", function() {
        window.location.href = `./write.html?post=${idPost}`;
    });

}

function removePost() {
    var removeBtn = document.querySelector(".action-delete_post");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);

    var raw = "";

    var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    removeBtn.addEventListener("click", function() {
        fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/post/${idPost}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (result.message === "Access is denied") {
                alert("Phím xa gà chết!\nBạn không được quyền xóa comment này trừ khi bạn là Admin =))")
            } else {
                alert("Đã xóa bài viết!");
                window.location.href = "./home.html";
            }
        })
        .catch(error => {
            console.log("error", error);
            alert("Đã có lỗi xảy ra !");
        });
    })
}

function clickToActionComment(id, content) {
    // console.log(id);
    var actionBtn = document.querySelector(".action-comment-" + id);
    // actionBtns.forEach(actionBtn => {
        actionBtn.addEventListener("click", function() {
            document.querySelector(".action-box_comment-" + id).classList.toggle("show-element");
            modifyComment(id, content);
            deleteComment(id);
        });
    // });
}

function modifyComment(idComment, oldContent) {
    var currentComment = document.querySelector(".comment-item-" + idComment);
    var editBtn = document.querySelector(".action-edit_comment-" + idComment);
    var textFill = document.querySelector(".comment-form-type");
    var submitNewComment = document.querySelector(".comment-submit_new");
    var submitUpdateComment = document.querySelector(".comment-submit_update");
    editBtn.addEventListener("click", function() {
        submitNewComment.classList.add("hidden-element");
        submitUpdateComment.classList.remove("hidden-element");
        textFill.value = oldContent;
        textFill.focus();
        currentComment.style.display = "none";


        

        submitUpdateComment.addEventListener("click", function() {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
            myHeaders.append("Content-type", "application/json");

            var raw = JSON.stringify({
                "content": document.querySelector(".comment-form-type").value
            });

            var requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            console.log(raw);
            fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/comment/${idComment}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                location.reload();
            })
            .catch(error => console.log("error", error));
        });
    });

}

function deleteComment(idComment) {
    var removeBtn = document.querySelector(".action-delete_comment-" + idComment);
    var currentComment = document.querySelector(".comment-item-" + idComment);

    removeBtn.addEventListener("click", function() {

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
        
        var raw = "";

        var requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/comment/${idComment}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.message === "Access is denied") {
                alert("Phím xa gà chết!\nBạn không được quyền xóa comment trừ khi bạn là Admin =))");
            } else {
                currentComment.style.display = "none";
            }
        })
        .catch(error => {
            alert("Đã có lỗi xảy ra!" + "\ncode: " + error);
            console.log("error", error)
        });
    });
}