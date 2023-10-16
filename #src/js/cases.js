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