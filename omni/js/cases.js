"use strict"
window.addEventListener("load", () => {
  if (document.querySelector(".works-card")) {
    document.querySelectorAll(".works-card").forEach(item => {
    if ( item.getAttribute("href").includes(sessionStorage.getItem("projectPath"))) {
      setTimeout(() => {
        sessionStorage.removeItem("projectPath")
      }, 200);
      item.click()
      return
    }
    })
  }
})
$(document).on('click', '.modal .js-pageup', function () {
  $('.modal__overlay').stop().animate(
    {
      scrollTop: 0, 
    },
    1500
  );
});
let i = 0
function loaded(item) {
    item.src = item.dataset.src
    if (item.parentNode.querySelector("source")) {
      item.parentNode.querySelectorAll("source").forEach(el => {
        el.srcset = el.dataset.srcset
      })
    }
}
function loadImg(lazyImages) {
    loaded(lazyImages[i])
    document.querySelectorAll(".lazy")[i].onload = function nextImg() {
      lazyImages[i].removeAttribute("data-src")
      if (lazyImages[i].parentNode.querySelector("source")) {
        lazyImages[i].parentNode.querySelectorAll("source").forEach(el => {
          el.removeAttribute('data-srcset')
        })
      }
      if (i === lazyImages.length - 1) {
        document.querySelector(".case__body").style.pointerEvents = "auto"
      }
      if (i < lazyImages.length - 1){
        i++
        loadImg(lazyImages)
      }
    }
}

if (document.querySelectorAll(".lazy").length > 0) {
  let lazyImages = document.querySelectorAll(".lazy")
   loadImg(lazyImages) 
}
function enableScroll() {
  if (document.querySelectorAll('.fixed-block')) {
    document.querySelectorAll('.fixed-block').forEach(block => block.style.paddingRight = '0px')
  }
  document.body.style.paddingRight = '0px'
  document.querySelector('.footer').style.right = '0px'
  document.body.classList.remove("dis-scroll")
}
//disable scroll
function disableScroll() {
  let paddingValue = window.innerWidth > 325 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
  if (document.querySelectorAll('.fixed-block')) {
    document.querySelectorAll('.fixed-block').forEach(block => block.style.paddingRight = paddingValue)
  }
  document.body.style.paddingRight = paddingValue
  document.querySelector('.footer').style.right = paddingValue
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
  },300);
}
/* document.querySelector(".case__body").addEventListener("click", ()=> {
    document.querySelector(".modal__inner").innerHTML = document.querySelector(".case__body").innerHTML
    setTimeout(() => {
      openModal(document.querySelector(".fancy-modal"))
    }, 0);
}) */
/* document.querySelector(".modal__overlay").addEventListener("click", e => {
  if (!document.querySelector(".modal__content").contains(e.target)) {
    closeModal(document.querySelector(".fancy-modal"))
  }
}) */

let f = location.href.split("/")
let e = f.findIndex(t => "proekty" === t)
if (e != -1 && (e != (f.length - 1)) && f[e+1] != "") {
  sessionStorage.setItem("projectPath",location.pathname)
  let url = f.slice(0, f.length - 1).join("/")
  window.location.replace(
  url ,
  );

} 
document.querySelector(".modal__overlay").addEventListener("scroll", () => {
  if (document.querySelector(".modal__overlay").scrollTop > 400) {
    document.querySelector(".js-pageup").classList.add("show")
  } else {
    document.querySelector(".js-pageup").classList.remove("show")
  }
})
function changeUrl(item) {
  let title
  let url
  if (!document.querySelector(".fancy-modal").classList.contains("open")) {
    url = window.location.href
    title = document.title
  }
  function fetchPage(item) {
    let href = item.getAttribute("href")
    //$( ".proj__cards" ).load( "swiss.html .case__body" );
    console.log(href)
    fetch(href)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Something went wrong');
      })
      .then(res => {
        let doc = (new window.DOMParser()).parseFromString(res, "text/html")
        document.title = doc.title
        document.querySelector('.fancy-modal .modal__inner').innerHTML = doc.querySelector(".case__content").innerHTML
       }) 
       .then(res => {
        openModal(document.querySelector('.fancy-modal'))
        window.history.pushState("", "", href)
        let modal = document.querySelector(".fancy-modal") 
        if (modal && modal.querySelector(".works-card")) {
          modal.querySelectorAll(".works-card").forEach(item => {
            item.addEventListener("click", e => {
              e.preventDefault()
              $('.modal__overlay').stop().animate(
                {
                  scrollTop: 0, 
                },
                1500
              );
              fetchPage(item)
            })
          })
          
        }
        if (modal && modal.querySelectorAll(".lazy").length > 0) {
          i = 0
          let lazyImages = modal.querySelectorAll(".lazy")
           loadImg(lazyImages) 
        }
        document.querySelector(".modal__overlay").addEventListener("click", e => {
          if (!document.querySelector(".modal__content").contains(e.target)) {
            document.title = title
            console.log(history)
            window.history.replaceState("", "", url)
            //window.history.back()
            closeModal(document.querySelector(".fancy-modal"))            
          }
        })
      
       }) 
      .catch((error) => {
        console.log(error)
      });
  }
  fetchPage(item)
}
if (document.querySelector(".works-card")) {
  document.querySelectorAll(".works-card").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault()
      changeUrl(item)
    })
  })
  
}