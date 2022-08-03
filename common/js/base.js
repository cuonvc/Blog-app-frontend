// var prePosition = window.pageYOffset;
// var toTop = document.querySelector(".to-top_btn");

// window.onscroll = function() {
//     //display navbar
//     var currentPosition = window.pageYOffset;
//     if(prePosition > currentPosition) {
//         document.getElementById("app-header").style.top = "0";
//     } else {
//         document.getElementById("app-header").style.top = "-80px";
//     }
//     prePosition = currentPosition;

//     //display to the top button
//     if(document.documentElement.scrollTop > 300) {
//         toTop.style.display = "block";
//     } else {
//         toTop.style.display = "none";
//     }
// }

// // click btn to the top
// toTop.onclick = function() {
//     console.log("hi");
//     document.documentElement.scrollTop = 0;
// }


// // Search on mobile

// if(window.innerWidth < 1024 
//         || document.documentElement.clientWidth < 1024 
//         || document.body.clientWidth < 1024) {

//     //add class (m_ - mobile) when resize window
//     document.querySelector(".navbar-search").classList.add("m_navbar-search");
//     document.querySelector(".navbar_back-icon").classList.add("m_navbar_back-icon");
//     document.querySelector(".navbar-search_type").classList.add("m_navbar-search_type");
//     const nodesE = document.querySelectorAll(".navbar_element");
//     for(var i = 0; i < nodesE.length; i++) {
//         nodesE[i].classList.add("m_navbar_element");
//     }

//     // select to class for mobile (not affect to PC size)
//     const navSearchform = document.querySelector(".m_navbar-search");
//     const navBackBtn = document.querySelector(".m_navbar_back-icon");
//     const navSearchType = document.querySelector(".m_navbar-search_type");
//     const nodesElement = document.querySelectorAll(".m_navbar_element");

//     // click to search form (mobile)
//     navSearchform.onclick = function() {
//         // console.log(navSearchform);
//         // console.log(navBackBtn);
//         // console.log(navSearchType);
//         // console.log(nodesElement);
    
//         nodesElement[0].classList.add("hidden-element");
//         nodesElement[2].classList.add("hidden-element");
//         navSearchType.style.display = "block";
//         navSearchform.style.margin = "auto";
//         navSearchform.style.width = "100%";
//         navBackBtn.style.display = "block";
//     }
    
//     // click to back button
//     navBackBtn.onclick = function(event) {
//         navBackBtn.style.display = "none";
//         navSearchType.style.display = "none";
//         navSearchform.style.margin = null;
//         navSearchform.style.width = null;
//         nodesElement[0].classList.remove("hidden-element");
//         nodesElement[2].classList.remove("hidden-element");
    
//         //ngăn sự kiện nổi bọt (khi click to thằng con thì thằng cha cũng bị dính click event)
//         event.stopPropagation();
//     }


// } else {

//     // remove các class m_ để PC size không bị ảnh hưởng bởi click event trên mobile
//     document.querySelector(".navbar-search").classList.remove("m_navbar-search");
//     document.querySelector(".navbar_back-icon").classList.remove("m_navbar_back-icon");
//     document.querySelector(".navbar-search_type").classList.remove("m_navbar-search_type");
//     const listE = document.querySelectorAll(".navbar_element");
//     for(var i = 0; i < listE.length; i++) {
//         listE[i].classList.remove("m_navbar_element");
//     }
// }


// // remove white space default in textarea tag
// var textForms = document.getElementsByTagName("textarea");
// for (var i = 0; i < textForms.length; i++) {
//     textForms[i].innerText = "";
// }

var prePosition = window.pageYOffset;
var toTop = document.querySelector(".to-top_btn");

window.onscroll = function() {
    //display navbar
    var currentPosition = window.pageYOffset;
    if(prePosition > currentPosition) {
        document.getElementById("app-header").style.top = "0";
    } else {
        document.getElementById("app-header").style.top = "-80px";
    }
    prePosition = currentPosition;

    //display to the top button
    if(document.documentElement.scrollTop > 300) {
        toTop.style.display = "block";
    } else {
        toTop.style.display = "none";
    }
}

// click btn to the top
function toTheTop() {
    console.log("hi");
    document.documentElement.scrollTop = 0;
}


// Search on mobile

if(window.innerWidth < 1024 
        || document.documentElement.clientWidth < 1024 
        || document.body.clientWidth < 1024) {

    //add class (m_ - mobile) when resize window
    var navSearchs = document.querySelectorAll(".navbar-search");
    var navBacks = document.querySelectorAll(".navbar_back-icon");
    var navSeachTypes = document.querySelectorAll(".navbar-search_type");
    const nodesE = document.querySelectorAll(".navbar_element");

    for(var i = 0; i < navSearchs.length; i++) {
        navSearchs[i].classList.add("m_navbar-search");
    }

    for(var i = 0; i < navBacks.length; i++) {
        navBacks[i].classList.add("m_navbar_back-icon");
    }

    for (var i = 0; i < navSeachTypes.length; i++) {
        navSeachTypes[i].classList.add("m_navbar-search_type");
    }

    for(var i = 0; i < nodesE.length; i++) {
        nodesE[i].classList.add("m_navbar_element");
    }

    // select to class for mobile (not affect to PC size)
    const navSearchform = document.querySelector(".m_navbar-search");
    const navBackBtn = document.querySelector(".m_navbar_back-icon");
    const navSearchType = document.querySelector(".m_navbar-search_type");
    const nodesElement = document.querySelectorAll(".m_navbar_element");

    // click to search form (mobile)
    navSearchform.onclick = function() {
    
        nodesElement[0].classList.add("hidden-element");
        nodesElement[2].classList.add("hidden-element");
        nodesElement[3].classList.add("hidden-element");
        navSearchType.style.display = "block";
        navSearchform.style.margin = "auto";
        navSearchform.style.width = "100%";
        navBackBtn.style.display = "block";
    }
    
    // click to back button
    navBackBtn.onclick = function(event) {
        navBackBtn.style.display = "none";
        navSearchType.style.display = "none";
        navSearchform.style.margin = null;
        navSearchform.style.width = null;
        nodesElement[0].classList.remove("hidden-element");
        nodesElement[2].classList.remove("hidden-element");
        nodesElement[3].classList.remove("hidden-element");
    
        //ngăn sự kiện nổi bọt (khi click to thằng con thì thằng cha cũng bị dính click event)
        event.stopPropagation();
    }


}


// remove white space default in textarea tag
var textForms = document.getElementsByTagName("textarea");
// console.log(textForms);
for (var i = 0; i < textForms.length; i++) {
    textForms[i].innerText = "";
}