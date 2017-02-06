//* global console */

(function(){
  function handlePopup(e) {
    var openClass = "tOpen";
    var closeButtonClass = "tBtClosePopup";
    var overlayClass = "tPopupOverlay";
    var popups = document.querySelectorAll('.tPopup');
    var container = this.parentElement;
    var btClosePopup = container.getElementsByClassName(closeButtonClass);
    var content = container.getElementsByClassName('tPopupContent')[0];

    function stopVideos(){
      var videos = document.getElementsByTagName('VIDEO');
      if(videos.length){
        for(var i=0; i<videos.length; i++){
         videos[i].pause();
        }
      }
    }//stopVideos()

    function closePopup(e) {
      stopVideos();

      // remove visibility classList
      container.classList.remove(openClass);

      // adjust z-index
      container.style.zIndex = "100";

      var overlay = container.getElementsByClassName(overlayClass)[0];
      overlay.parentNode.removeChild(overlay);

      e.preventDefault();
    }//closePopup(e)

    function openPopup(e) {   
      // overlay
      var overlay = document.createElement("div");
      overlay.classList.add(overlayClass);
      container.appendChild(overlay);

      // adjust z-index
      popups.forEach(function(popup){
        popup.style.zIndex = "100";
      });
      container.style.zIndex = "1000";

      // stop videos
      stopVideos();

      //open popup
      container.classList.add(openClass);
      e.preventDefault();
    }

    if(!btClosePopup.length) {
        btClosePopup = document.createElement("a");
        btClosePopup.classList.add(closeButtonClass);
        btClosePopup.setAttribute("href", "#");
        btClosePopup.addEventListener('click', closePopup);
        content.appendChild(btClosePopup);
    }

    // close if open, open if closed
    if(container.classList.contains(openClass)){
        closePopup(e);
    } else {
        openPopup(e);
    }
    e.preventDefault();
  }

  var btPopups = document.querySelectorAll('.tBtOpenPopup');
  btPopups.forEach(function(button) {
      button.addEventListener('click', handlePopup);
  });

})();