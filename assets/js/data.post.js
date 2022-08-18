const idUrl = window.location.hash;
let idPost = idUrl.substring(1);

getPostById(function (post) {
    renderPostById(post);
});

function getPostById(callback) {
    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/post/" + idPost)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

registerAccoutUser();

function renderPostById(postById) {
    const titlePage = document.getElementById("title-post_guest");
    const categoryBox = document.querySelector(".body-post_category-list");
    const titleBox = document.querySelector(".body-post_title");
    const postAuthBox = document.querySelector(".body-post_auth");
    const postContentBox = document.querySelector(".body-post_content");
    const commentListBox = document.querySelector(".comment-list");

    titlePage.innerHTML = postById.title;

    let firstCategory = `<li class="body-post_cateogry-item"><a href="#">${postById.categories[0].name}</a></li>`;
    categoryBox.innerHTML = firstCategory;

    let titleHtml = `<h1 class="post_title--text">${postById.title}</h1>`;
    titleBox.innerHTML = titleHtml;

    var postCreDate = formatDate(postById.createdDate);
    let postAuthHtml = `
        <div class="body-post_auth-avt">
            <a style="cursor: pointer;" class="sign_in-btn">
                <img src="${postById.userProfile.avatarPhoto}" alt="avt">
            </a>
        </div>
        <div class="body-post_auth-name">
            <a style="cursor: pointer;" class="sign_in-btn">
                ${postById.userProfile.firstName} ${postById.userProfile.lastName}
                <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
            </a>
            <span>${postCreDate}</span>
        </div>
    `;
    postAuthBox.innerHTML = postAuthHtml;
    
    let confirmIcon = postAuthBox.querySelector(".icon_admin-name");
    validateAdmin(postById, confirmIcon);

    let contentHtmls = `${postById.content}`;
    postContentBox.innerHTML = contentHtmls;


    let commentList = "";
    var length = postById.comments.length;

    for (var i = 0; i < length; i++) {
        var commentCreDate = formatDate(postById.comments[i].createdDate);
        var commentMofDate = formatDate(postById.comments[i].modifiedDate);
        let commentItem = `
            <div class="comment-item">
                <div class="comment-item_auth row no-gutters">
                    <div class="comment-item_avt">
                        <a style="cursor: pointer;" class="sign_in-btn">
                            <img src="${postById.comments[i].userProfile.avatarPhoto}" alt="">
                        </a>
                    </div>
                    <div class="comment-item_info">
                        <a style="cursor: pointer;" class="sign_in-btn">
                            ${postById.comments[i].userProfile.firstName} ${postById.comments[i].userProfile.lastName}
                            <i style="display: none;" class="icon_admin-name fa-solid fa-circle-check"></i>
                        </a>
                        <span class="row no-gutters">
                            <p class="comment-item_info-create">${commentCreDate}</p>
                            &nbsp;(Chỉnh sửa:&nbsp;<p class="comment-item_info-modify">${commentMofDate}</p>)
                        </span>
                    </div>
                </div>
                <div class="comment-item_content">
                    <p>${postById.comments[i].content}</p>
                </div>
            </div>
        `;
        commentList += commentItem;
    }
    commentListBox.innerHTML = commentList;

    let confirmIcons = document.querySelector(".comment-list")
        .querySelectorAll(".icon_admin-name");
    for (let i = 0; i < postById.comments.length; i++) {
        validateAdmin(postById.comments[i], confirmIcons[i]);
    }
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}

function validateAdmin(obj, icon) {
    if (obj.userProfile.roles[0].name === "ROLE_ADMIN") {
        icon.style.display = "inline";
    }
}

function registerAccoutUser() {

    var signupBtn = document.querySelector("#modal-submit_re");
    signupBtn.addEventListener("click", function() {

        var lastName = document.querySelector("#input_last-name_re");
        var firstName = document.querySelector("#input_first-name-re");
        var username = document.querySelector("#input_username_re");
        var email = document.querySelector("#input_email_re");
        var password = document.querySelector("#input_password_re");
        var rePassword = document.querySelector("#input_re-password_re");

        if (password.value === rePassword.value) {
            var myHeaders = new Headers();
            myHeaders.append("Content-type", "application/json");
    
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
    
            fetch("https://nvc-rest-blog.herokuapp.com/api/v1/auth/user/signup", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === "User register successfully!") {
                    alert("Đăng ký thành công, hãy quay lại đăng nhập!");
                    document.querySelector(".modal").style.display = "none";
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