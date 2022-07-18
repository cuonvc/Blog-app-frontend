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
toTop.onclick = function() {
    console.log("hi");
    document.documentElement.scrollTop = 0;
}

