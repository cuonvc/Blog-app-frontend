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

getUserProfile();
searchPosts();
// window.addEventListener("load", function() {
    
// });

function getUserProfile() {
    fetch(`https://nvc-rest-blog.herokuapp.com/api/v1/profile/${username}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        renderHeaderInfo(data);
        renderContent(data);
        
    });
}

function renderHeaderInfo(data) {
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
}

function renderContent(data) {
    let about = "";
    if (data.about === null || data.about === "") {
        about = "Hãy mô tả đôi chút về bản thân bạn!";
    } else {
        about = data.about;
    }
    const content = `
        <div class="row mg-bottom-30">
            <div class="setting_about-me col l-6 m-6 s-12">
                <div class="setting_title">
                    <span>Chỉnh sửa mô tả</span>
                </div>
                <div class="setting_content">
                    <textarea rows="3" name="" 
                        class="setting_about-me_text row no-gutters" 
                        spellcheck="false" placeholder="${about}" ></textarea>
                </div>
            </div>
            <div class="setting_email col l-6 m-6 s-12">
                <div class="setting_title">
                    <span>Chỉnh sửa email</span>
                </div>
                <div class="setting_content">
                    <input class="setting_input setting_email-input" type="email" placeholder="${data.emailByUser}">
                </div>
            </div>
        </div>
        <div class="row mg-bottom-30">
            <div class="setting_first-name col l-6 m-6 s-12">
                <div class="setting_title">
                    <span>Chỉnh sửa tên</span>
                </div>
                <div class="setting_content">
                    <input type="text" class="setting_input setting_name_input" placeholder="${data.firstName}">
                </div>
            </div>
            <div class="setting_last-name col l-6 m-6 s-12">
                <div class="setting_title">
                    <span>Chỉnh sửa họ</span>
                </div>
                <div class="setting_content">
                    <input type="text" class="setting_input setting_name_input" placeholder="${data.lastName}">
                </div>
            </div>
        </div>
        <div class="row mg-bottom-30">
            <div class="setting_date-of-birth col l-6 m-6 s-12">
                <div class="setting_title">
                    <span>Chỉnh sửa ngày sinh</span>
                </div>
                <div class="setting_content">
                    <input type="date" class="setting_input setting_dob-input" value="${formatDate(data.dateOfBirth)}">
                </div>
            </div>
            <div class="setting_gender col l-6 m-6 s-12">
                <div class="setting_title">
                    <span>Chỉnh sửa giới tính</span>
                </div>
                <div class="setting_content">
                    <select class="setting_gender_select" name="gender" id="gender">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
            </div>
        </div>
    `
    document.querySelector("#app-setting").innerHTML = content;
    var submitBtn = document.querySelector(".setting-save_btn");
    submitBtn.addEventListener("click", function() {
        saveInfo(data);
    });
}

function saveInfo(data) {
    
    var descriptionContent = document.querySelector(".setting_about-me_text").value;
    if (descriptionContent === null || descriptionContent === "") {
        descriptionContent = data.about;
    }
    var emailContent = document.querySelector(".setting_email-input").value;
    if (emailContent === null || emailContent === "") {
        emailContent = data.emailByUser;
    }

    var firstNameContent = document.querySelectorAll(".setting_name_input")[0].value;
    if (firstNameContent === null || firstNameContent === "") {
        firstNameContent = data.firstName;
    }

    var lastNameContent = document.querySelectorAll(".setting_name_input")[1].value;
    if (lastNameContent === null || lastNameContent === "") {
        lastNameContent = data.lastName;
    }

    var dobContent = document.querySelector(".setting_dob-input").value;
    if (dobContent === null || dobContent === "") {
        dobContent = data.dateOfBirth;
    }
    var gender = document.querySelector(".setting_gender_select").value;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    myHeaders.append("Content-type", "application/json");

    var raw = JSON.stringify({
        "emailByUser": emailContent,
        "firstName": firstNameContent,
        "lastName": lastNameContent,
        "gender": gender,
        "dateOfBirth": dobContent,
        "about": descriptionContent
    });

    var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirec: "follow"
    };
    
    fetch("https://nvc-rest-blog.herokuapp.com/api/v1/profile", requestOptions)
    .then(response => response.json())
    .then(result => {
        if (result.message === "Email invalid") {
            alert("Email không đúng định dạng!");
        } else if (result.message === "Email was created by difference user") {
            alert("Email này đã được đăng ký một tài khoản!");
        } else if (result.emailByUser !== undefined) {
            alert("Cập nhật thành công");
        } else {
            alert("Đã xảy ra lỗi!");
        }
    })
    .catch(error => alert(error));
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
    return dateView.getFullYear() + "-" + (dateView.getMonth() + 1) + "-" + dateView.getDate();
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