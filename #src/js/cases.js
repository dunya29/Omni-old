"use strict"
//"/" udalit github
document.addEventListener("DOMContentLoaded", ()=> {
  let urlArr = location.href.split("/")
  console.log(urlArr)
  let idx = urlArr.findIndex(i => "proekty" === i)
  if (idx != -1 && (idx != (urlArr.length - 1)) && urlArr[idx + 1] != "") {
    sessionStorage.setItem("projectPath", urlArr[urlArr.length - 1])
    //sessionStorage.setItem("projectPath", location.pathname)
    let url = urlArr.slice(0, urlArr.length - 1).join("/")
    window.location.replace(
      //url,
      url + "/",
    );
  }
})
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
    if (i < lazyImages.length - 1) {
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
  }, 300);
}

function changeUrl(item) {
  let title
  let url
  if (!document.querySelector(".fancy-modal").classList.contains("open")) {
    url = window.location.href
    title = document.title
  }
  function fetchPage(item) {
    let href = item.getAttribute("href")
    if (!document.querySelector('.fancy-modal').classList.contains("open")) {
      openModal(document.querySelector('.fancy-modal'))
    }
     document.querySelector('.fancy-modal .modal__inner').innerHTML = 
    `<div class="modal-loading-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="26.349px" height="26.35px" viewBox="0 0 26.349 26.35" style="enable-background:new 0 0 26.349 26.35;"
          xml:space="preserve">
         <g>
           <circle cx="13.792" cy="3.082" r="3.082"/>
           <circle cx="13.792" cy="24.501" r="1.849"/>
           <circle cx="6.219" cy="6.218" r="2.774"/>
           <circle cx="21.365" cy="21.363" r="1.541"/>
           <circle cx="3.082" cy="13.792" r="2.465"/>
           <circle cx="24.501" cy="13.791" r="1.232"/>
           <path d="M4.694,19.84c-0.843,0.843-0.843,2.207,0,3.05c0.842,0.843,2.208,0.843,3.05,0c0.843-0.843,0.843-2.207,0-3.05
             C6.902,18.996,5.537,18.988,4.694,19.84z"/>
           <circle cx="21.364" cy="6.218" r="0.924"/>
         </g>
       
       </svg></div>` 
       document.querySelector(".modal .btn-main").opacity = 0
       document.querySelector(".modal .btn-main").visibility = "hidden"
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
        document.querySelector(".modal .btn-main").opacity = 1
        document.querySelector(".modal .btn-main").visibility = "visible"
    /*   })
      .then(res => {
        openModal(document.querySelector('.fancy-modal')) */
        window.history.pushState("", "", href)
        let modal = document.querySelector(".fancy-modal")
        if (modal && modal.querySelector(".works-card")) {
          modal.querySelectorAll(".works-card").forEach(item => {
            item.addEventListener("click", e => {
              e.preventDefault()
              fetchPage(item)
            })
          })

        }
        if (modal && modal.querySelectorAll(".lazy").length > 0) {
          i = 0
          let lazyImages = modal.querySelectorAll(".lazy")
          loadImg(lazyImages)
        }
       /*  document.querySelector(".modal__overlay").addEventListener("click", e => {
          if (!document.querySelector(".modal__content").contains(e.target)) {
            document.title = title
            window.history.replaceState("", "", url)
            //window.history.back()
            closeModal(document.querySelector(".fancy-modal"))
          }
        })  */
        document.querySelector(".modal__close").addEventListener("click", e => {
            document.title = title
            window.history.replaceState("", "", url)
            closeModal(document.querySelector(".fancy-modal"))
        }) 

      })
      .catch((error) => {
        console.log(error)
      });
  }
  fetchPage(item)
}
window.addEventListener("load", () => {
  if (document.querySelector(".works-card")) {
    document.querySelectorAll(".works-card").forEach(item => {
      item.addEventListener("click", e => {
        e.preventDefault()
        changeUrl(item)
      })
    })
  
  }
  if (document.querySelector(".works-card")) {
    document.querySelectorAll(".works-card").forEach(item => {
      if (item.getAttribute("href").includes(sessionStorage.getItem("projectPath"))) {
        setTimeout(() => {
          sessionStorage.removeItem("projectPath")
        }, 200);
       item.click()
        return
      }
    })
  }
  $(document).on('click', '.modal .js-pageup', function () {
    $('.modal__overlay').stop().animate(
      {
        scrollTop: 0,
      },
      1500
    );
  });
  if (document.querySelector(".modal__overlay")) {
    document.querySelector(".modal__overlay").addEventListener("scroll", () => {
      if (document.querySelector(".modal__overlay").scrollTop > 400) {
        document.querySelector(".js-pageup").classList.add("show")
      } else {
        document.querySelector(".js-pageup").classList.remove("show")
      }
    })
  }
  
})