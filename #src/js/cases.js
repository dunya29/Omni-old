"use strict"
$(document).on('click', '.modal .js-pageup', function () {
  $('.modal__overlay').stop().animate(
    {
      scrollTop: 0, 
    },
    1000
  );
});
let lazyImages = document.querySelectorAll(".lazy")
let i = 0
function loaded(item) {
    item.src = item.dataset.src
    if (item.parentNode.querySelector("source")) {
      item.parentNode.querySelectorAll("source").forEach(el => {
        el.srcset = el.dataset.srcset
      })
    }
}
function loadImg() {
    loaded(lazyImages[i])
    document.querySelectorAll(".lazy")[i].onload = function nextImg() {
      lazyImages[i].style.height = "auto"
      if (i === lazyImages.length - 1) {
        document.querySelector(".case__body").style.pointerEvents = "auto"
      }
      if (i < lazyImages.length - 1){
        i++
        loadImg()
      }
    }
}
if (lazyImages.length > 0) {
    loadImg() 
}
function enableScroll() {
  if (document.querySelectorAll('.fixed-block')) {
    document.querySelectorAll('.fixed-block').forEach(block => block.style.paddingRight = '0px')
  }
  document.body.style.paddingRight = '0px'
  document.body.classList.remove("dis-scroll")
}
//disable scroll
function disableScroll() {
  let paddingValue = window.innerWidth > 325 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
  if (document.querySelectorAll('.fixed-block')) {
    document.querySelectorAll('.fixed-block').forEach(block => block.style.paddingRight = paddingValue)
  }
  document.body.style.paddingRight = paddingValue
  document.body.classList.add("dis-scroll");
}
//show modal
function openModal(modal) {
  disableScroll()
  modal.classList.add("open")
}
// unshow modal
function closeModal(modal) {
  modal.classList.remove("open")
  setTimeout(() => {
      enableScroll()
  },400);
}
document.querySelector(".case__body").addEventListener("click", ()=> {
    openModal(document.querySelector(".fancy-modal"))
    document.querySelector(".modal__inner").innerHTML = document.querySelector(".case__body").innerHTML
})
document.querySelector(".modal__close").addEventListener("click", ()=>closeModal(document.querySelector(".fancy-modal")))