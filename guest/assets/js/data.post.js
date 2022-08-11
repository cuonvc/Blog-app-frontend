const idUrl = window.location.hash;
let idPost = idUrl.substring(1);

getPostById(function (post) {
    renderPostById(post);
});

function getPostById(callback) {
    fetch("http://localhost:8080/api/v1/post/" + idPost)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

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
            <a href="#">
                <img src="${postById.userProfile.avatarPhoto}" alt="avt">
            </a>
        </div>
        <div class="body-post_auth-name">
            <a href="#">${postById.userProfile.firstName} ${postById.userProfile.lastName}</a>
            <span>${postCreDate}</span>
        </div>
    `;
    postAuthBox.innerHTML = postAuthHtml;

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
                        <a href="#">
                            <img src="${postById.comments[i].userProfile.avatarPhoto}" alt="">
                        </a>
                    </div>
                    <div class="comment-item_info">
                        <a href="#">${postById.comments[i].userProfile.firstName} ${postById.comments[i].userProfile.lastName}</a>
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
}

function formatDate(dateString) {
    var dateView = new Date(dateString);
    return dateView.getDate() + " th" + (dateView.getMonth() + 1) + ", " + dateView.getFullYear();
}