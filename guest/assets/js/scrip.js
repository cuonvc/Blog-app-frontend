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