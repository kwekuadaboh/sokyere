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

$(document).on("click", "#nav__items .nav__item", function () {
  $(this).addClass("selected").siblings().removeClass("selected");
});
