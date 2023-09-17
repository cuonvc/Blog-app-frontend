var postsApi = 'https://localhost:44377/api/post/all?pageNumber=1&pageSize=5';
// var postByIdApi = '';
var postsList = document.querySelectorAll(".post_list");

start();

function start() {
    getPosts(function (posts) {
        renderPostsNew(posts.data);
    });

    renderPostsPin();

    registerAccoutUser();
    loginWithGoogle();
}


// Content post by ID

// function getPostById(callback) {
//     let idPost = localStorage.getItem("postID")
//     fetch("https://localhost:44377/api/v1/post/" + idPost)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(callback);
// }

// function renderPostById(postById) {
//     const titlePage = document.getElementById("title-post_guest");
//     const categoryBox = document.querySelector(".body-post_category-list");
//     const titleBox = document.querySelector(".body-post_title");
//     const postAuthBox = document.querySelector(".body-post_auth");
//     const postContentBox = document.querySelector(".body-post_content");
//     const commentListBox = document.querySelector(".comment-list");

//     titlePage.innerHTML = postById.title;

//     let firstCategory = `<li class="body-post_cateogry-item"><a href="#">${postById.categories[0].name}</a></li>`;
//     categoryBox.innerHTML = firstCategory;

//     let titleHtml = `<h1 class="post_title--text">${postById.title}</h1>`;
//     titleBox.innerHTML = titleHtml;

//     var postCreDate = formatDate(postById.createdDate);
//     let postAuthHtml = `
//         <div class="body-post_auth-avt">
//             <a href="#">
//                 <img src="${postById.userProfile.avatarPhoto}" alt="avt">
//             </a>
//         </div>
//         <div class="body-post_auth-name">
//             <a href="#">${postById.userProfile.firstName} ${postById.userProfile.lastName}</a>
//             <span>${postCreDate}</span>
//         </div>
//     `;
//     postAuthBox.innerHTML = postAuthHtml;

//     let contentHtmls = `${postById.content}`;
//     postContentBox.innerHTML = contentHtmls;

//     let commentList = "";
//     var length = postById.comments.length;

//     for (var i = 0; i < length; i++) {
//         var commentCreDate = formatDate(postById.comments[i].createdDate);
//         var commentMofDate = formatDate(postById.comments[i].modifiedDate);
//         let commentItem = `
//             <div class="comment-item">
//                 <div class="comment-item_auth row no-gutters">
//                     <div class="comment-item_avt">
//                         <a href="#">
//                             <img src="${postById.comments[i].userProfile.avatarPhoto}" alt="">
//                         </a>
//                     </div>
//                     <div class="comment-item_info">
//                         <a href="#">${postById.comments[i].userProfile.firstName} ${postById.comments[i].userProfile.lastName}</a>
//                         <span class="row no-gutters">
//                             <p class="comment-item_info-create">${commentCreDate}</p>
//                             &nbsp;(Chỉnh sửa:&nbsp;<p class="comment-item_info-modify">${commentMofDate}</p>)
//                         </span>
//                     </div>
//                 </div>
//                 <div class="comment-item_content">
//                     <p>${postById.comments[i].content}</p>
//                 </div>
//             </div>
//         `;
//         commentList += commentItem;
//     }
//     commentListBox.innerHTML = commentList;
// }


// content list posts

function getPosts(callback) {
    fetch(postsApi)
        .then(function(reponse) {
            return reponse.json();
        })
        .then(callback);
}

function saveIdLocalStorage(id) {
    localStorage.setItem("postID", id);
    setTimeout(() => {
        location.href = `/guest/post.html?post=${id}`;
    }, 100);
}

function renderPostsPin() {
    fetch("https://localhost:44377/api/post/all?pageNumber=1&pageSize=100")
    .then(response => response.json())
    .then(posts => {
        let htmls = "";
        let arrPosts = posts.data;
    
        let arrPostsPin = [];
        arrPosts.map(post => {
            if (post.pined === true) {
                arrPostsPin.push(post);
            }
        });
    
        arrPostsPin.forEach(post => {
            var firstCategory = post.categories[0];
            var finalDate = formatDate(post.createdDate);
            let html =
                `
                <div class="row">
                    <div class="post-pin l-9 m-12 s-12 col">
                        <div class="content-post_pin row post" id="${post.id}">
                            <a style="cursor: pointer" href="./post.html#${post.id}" class="l-4 m-4 s-4">
                                <div class="post-pin_image" style="background-image: url(${post.thumbnail});">
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
    });
}

function renderPostsNew(posts) {
    let htmls = "";
    let arrPosts = posts;

    arrPosts.forEach(post => {
        var firstCategory = post.categories[0];
        var finalDate = formatDate(post.createdDate);
        let html = `
            <div class="col l-3 m-4 s-12">
                <div class="content-post_new">
                    <a style="cursor: pointer" href="./post.html#${post.id}" class="post-link content-post_link">
                        <div class="content-post_image" style="background-image: url(${post.thumbnail});">
                        </div>
                    </a>
                    
                    <div class="content-post_text">
                        <div class="content-post_categories">
                            <a href="#" class="content-post_category">${firstCategory.name}</a>
                        </div>
                        <div class="content-post_title">
                            <a href="./post.html#${post.id}" class="post-link content-post_link">${post.title}</a>
                        </div>
                        <div class="content-post_description">
                            <p>${post.description}</p>
                        </div>
                        <div class="content-post_info">
                            <a href="#" class="content-post_auth">
                                <img src="${post.user.avatarPhoto}" alt="Avartar">
                                <span>
                                    ${post.user.firstName} ${post.user.lastName}
                                    <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                                </span>
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

    let contentBox = document.querySelector(".content-posts");
    contentBox.innerHTML = htmls;

    let confirmIcons = contentBox.querySelectorAll(".icon_admin-name");
    validateAdmin(arrPosts, confirmIcons);
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function validateAdmin(listPost, icons) {
    for (let i = 0; i < listPost.length; i++) {
        if (listPost[i].user.role === "ADMIN_ROLE" || listPost[i].user.role === "MOD_ROLE") {
            icons[i].style.display = "inline";
        }
    }
}

function registerAccoutUser() {

    var signupBtn = document.querySelector("#modal-submit_re");
    signupBtn.addEventListener("click", function() {

        var lastName = document.querySelector("#input_last-name_re");
        var firstName = document.querySelector("#input_first-name-re");
        var email = document.querySelector("#input_email_re");
        var password = document.querySelector("#input_password_re");
        var rePassword = document.querySelector("#input_re-password_re");

        if (password.value === rePassword.value) {
            var myHeaders = new Headers();
            myHeaders.append("Content-type", "application/json");
    
            var raw = JSON.stringify({
                "firstName": firstName.value,
                "lastName": lastName.value,
                "email": email.value,
                "password": password.value
            });
    
            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
    
            fetch("https://localhost:44377/api/auth/signup", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.code === 200) {
                    alert("Đăng ký thành công, hãy quay lại đăng nhập!");
                    document.querySelector(".modal").style.display = "none";
                } else if (result.code === 400) {
                    alert("Email đã được đăng ký trước đó");
                } else {
                    alert("Nhiều case quá nên bạn thấy lỗi ở đâu thì điền lại đó nhé :v\n \n" + result);
                }
            })
            .catch(error => {
                console.log(error);
                alert("Không thể tạo tài khoản, vui lòng thử lại!");
            });
        } else {
            alert("Password không trùng khớp!");
        }

    })
}

function loginWithGoogle() {
    let btn = document.querySelector(".oauth-google_btn").addEventListener("click", () => {
        const clientId = '723628015267-pbpd2m5br737v69gajc8n1d4geqhpeo7.apps.googleusercontent.com';
        const redirectUri = 'http://127.0.0.1:5500/client/home.html';
        const scope = 'email profile';

        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
        window.location.href = authUrl;
    })
}