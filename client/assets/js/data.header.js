var headerPages = document.querySelector(".navbar-user");
console.log(headerPages);

fetch('http://localhost:8080/api/v1/profile/2')
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
})