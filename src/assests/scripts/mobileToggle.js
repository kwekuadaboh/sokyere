const navToggle = document.querySelector(".nav__toggle");
const showHeader = document.querySelector("#header");
var navItems = document.querySelectorAll(".nav__item");
const headerAvater = document.querySelector(".header__avater");

var navLinks = document.querySelectorAll("nav__link");

navToggle.addEventListener("click", function (e) {
  e.preventDefault(), navToggle.classList.toggle("is-active");

  showHeader.classList.toggle("show-Header");

  navItems.forEach((item) => item.classList.toggle("show-navItems"));

  headerAvater.classList.toggle("show-Avater");
});

// for (var i = 0; i < navLinks.length; i++) {
//   navLinks[i].addEventListener("click", function () {});
// }
