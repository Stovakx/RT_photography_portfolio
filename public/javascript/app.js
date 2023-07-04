//scroling down hide navbar scrolling up shows navbar
var prevScrollpos = window.scrollY;
var headerNavbar = document.getElementById("headerNavbar");
var delayTimer = null;
var delayDuration = 500; // Adjust the delay duration (in milliseconds) as needed
var navbarOpen = false;

window.onscroll = function() {
    var currentScrollPos = window.scrollY;

    if (prevScrollpos > currentScrollPos && !navbarOpen) {
        clearTimeout(delayTimer);
        headerNavbar.classList.remove("hidden");
        headerNavbar.classList.remove("translucent");
    } else if (currentScrollPos <= 0 && !navbarOpen) {
        clearTimeout(delayTimer);
        headerNavbar.classList.remove("hidden");
        headerNavbar.classList.add("translucent");
    } else {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
            headerNavbar.classList.add("hidden");
        }, delayDuration);
    }

    prevScrollpos = currentScrollPos;
};

document.addEventListener("DOMContentLoaded", function() {
    var navbarToggler = document.querySelector(".navbar-toggler");
    navbarToggler.addEventListener("click", function() {
        navbarOpen = !navbarOpen;
        if (!navbarOpen) {
            headerNavbar.classList.remove("hidden");
        }
    });
});
