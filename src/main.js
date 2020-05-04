// function(e) {
//   e.preventDefault(),
//     this.classList.toggle('is-active')
// }

let navToggle = document.querySelector('.nav__toggle')
let showHeader = document.querySelector('#header')
let hideHeroText = document.querySelector('.hero__text')
navToggle.addEventListener('click', function (e) {
  e.preventDefault(),
    navToggle.classList.toggle('is-active')
  showHeader.classList.toggle('show-header')
  hideHeroText.classList.toggle('hideText')
})