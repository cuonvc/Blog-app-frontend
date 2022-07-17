//scroll header
var prePosition = window.pageYOffset;

window.onscroll = function() {
    var currentPosition = window.pageYOffset;
    if(prePosition > currentPosition) {
        document.getElementById("app-header").style.top = "0";
    } else {
        document.getElementById("app-header").style.top = "-80px";
    }
    prePosition = currentPosition;
}

//click search navbar
var searchBtn = document.querySelector(".navbar-search");
searchBtn.onclick = function() {
    var nodes = document.querySelectorAll(".navbar_element");
    var trigger = document.querySelector(".navbar-search_type");
    console.log(nodes);
    nodes[0].classList.add("hidden-element");
    nodes[2].classList.add("hidden-element");
    trigger.style.display = "block";
    searchBtn.style.margin = "auto";
}

// scroll the page to hidden, show to the top btn

// click btn to the top
var toTop = document.querySelector(".to-top_btn");
toTop.onclick = function() {
    console.log("hi");
    document.documentElement.scrollTop = 0;
}