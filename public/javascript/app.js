//scroling down hide navbar scrolling up shows navbar
var prevScrollpos = window.scrollY;
var headerNavbar = document.getElementById("headerNavbar");

window.onscroll = function() {
    var currentScrollPos = window.scrollY;

    if (prevScrollpos > currentScrollPos) {
        headerNavbar.classList.remove("hidden");
       /*  headerNavbar.classList.add('translucent'); */
    } else if (currentScrollPos <= 0) {
        headerNavbar.classList.remove("hidden");
        headerNavbar.classList.add('translucent');
    } else {
        headerNavbar.classList.add("hidden");
    }

    prevScrollpos = currentScrollPos;
};

