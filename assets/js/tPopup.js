/* global console */

(function(){
  var openClass = "tOpen";
  var closeButtonClass = "tBtClosePopup";
  var overlayClass = "tPopupOverlay";
  var zIndex = 100;
  var gap = 16;

  function handlePopup(e) {
    var popup = {};
    popup.container = this.parentElement;
    popup.type = popup.container.dataset.type;
    popup.closeButton = popup.container.getElementsByClassName(closeButtonClass);
    popup.content = popup.container.getElementsByClassName('tPopupContent')[0];

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
      popup.container.classList.remove(openClass);

      // if it is a modal popup
      if(popup.type === "modal") {
        // remove overlay
        popup.overlay = popup.container.getElementsByClassName(overlayClass)[0];
        popup.overlay.parentNode.removeChild(popup.overlay);
      }
      e.preventDefault();
    }//closePopup(e)

    function placePopupInplace(e){

      var screenWidth = window.innerWidth;

      popup.trigger = {};
      popup.trigger.left = e.target.offsetLeft;
      popup.trigger.top = e.target.offsetTop;

      // default positioning
      var newPosition = {};
      newPosition.left = popup.trigger.left;
      newPosition.top = popup.trigger.top - (popup.content.offsetHeight + gap);

      // hadle overflow from top
      if(newPosition.top < 10) {
        newPosition.top = popup.trigger.top + gap;
      }

      // hadle overflow from right
      if( (newPosition.left + gap + popup.content.offsetWidth) > (screenWidth - 10) ) {
        newPosition.left = screenWidth - ( gap + popup.content.offsetWidth );
      }     

      popup.content.style.top = newPosition.top + 'px';
      popup.content.style.left = newPosition.left + 'px';
      
      console.group(e.target);
      console.log('trigger.left: ' + popup.trigger.left);
      console.log('trigger.top: ' + popup.trigger.top);
      console.log('content.offsetHeight: ' + popup.content.offsetHeight);
      console.log('popup.content.offsetWidth: ' + popup.content.offsetWidth);
      console.log('screenWidth: ' + screenWidth);
      console.log(popup.content);
      console.groupEnd(e.target);
    }

    function openPopup(e) {   

      // handle different popup types differently
      switch (popup.type) {
        case 'modal':
          // put an overlay
          popup.overlay = document.createElement("div");
          popup.overlay.classList.add(overlayClass);
          zIndex++;
          popup.overlay.style.zIndex = zIndex;
          popup.container.appendChild(popup.overlay);
          break;
        case 'inplace':
          placePopupInplace(e);
          break;
        // case 'bottom':
        //   break;
      }

      // adjust z-index
      zIndex++;
      popup.content.style.zIndex = zIndex;

      // stop videos
      stopVideos();      
      
      //open popup
      popup.container.classList.add(openClass);
      e.preventDefault();
    }

    if(!popup.closeButton.length) {
        popup.closeButton = document.createElement("a");
        popup.closeButton.classList.add(closeButtonClass);
        popup.closeButton.setAttribute("href", "#");
        popup.closeButton.addEventListener('click', closePopup);
        popup.content.appendChild(popup.closeButton);
    }

    // close if open, open if closed
    if(popup.container.classList.contains(openClass)){
        closePopup(e);
    } else {
        openPopup(e);
    }
    e.preventDefault();
  }


  //open popup event listener
  document.querySelectorAll('.tBtOpenPopup').forEach(function(button) {
      button.addEventListener('click', handlePopup);
  });

})();