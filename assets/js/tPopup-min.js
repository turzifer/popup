!function(){function e(e){function t(){var e=document.getElementsByTagName("VIDEO");if(e.length)for(var t=0;t<e.length;t++)e[t].pause()}function n(e){t(),r.classList.remove(l),r.style.zIndex="100";var n=r.getElementsByClassName(c)[0];n.parentNode.removeChild(n),e.preventDefault()}function a(e){var n=document.createElement("div");n.classList.add(c),r.appendChild(n),o.forEach(function(e){e.style.zIndex="100"}),r.style.zIndex="1000",t(),r.classList.add(l),e.preventDefault()}var l="tOpen",s="tBtClosePopup",c="tPopupOverlay",o=document.querySelectorAll(".tPopup"),r=this.parentElement,d=r.getElementsByClassName(s),i=r.getElementsByClassName("tPopupContent")[0];d.length||(d=document.createElement("a"),d.classList.add(s),d.setAttribute("href","#"),d.addEventListener("click",n),i.appendChild(d)),r.classList.contains(l)?n(e):a(e),e.preventDefault()}var t=document.querySelectorAll(".tBtOpenPopup");t.forEach(function(t){t.addEventListener("click",e)})}();