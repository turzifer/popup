// /*  tPopup.js 2.0.0 | (c) May 2023, turzifer. | turzifer.com */
// /*  used with _trz-Popup.scss */


(() => {
  const CLASS_TOGGLED = "trz-toggled";
  const CLASS_CURRENT = "trz-current";
  const CLASS_POPUP = "trz-popup";
  const CLASS_CONTENT = "trz-content";
  const CLASS_OPEN_BUTTON = "trz-bt-open-popup";
  const CLASS_CLOSE_BUTTON = "trz-bt-close-popup";
  const CLASS_MULTI_PAGE_POPUP = "trz-multi-page-popup";
  const CLASS_POPUP_NAVIGATION = "trz-popup-navigation";
  const CLASS_POPUP_PREVIOUS = "trz-popup-previous";
  const CLASS_POPUP_NEXT = "trz-popup-next";

  let popupContentIndex = 0;

  /*
  Returns the tag as html element
  tag_name:       String. The name of the tag (div, li, a...)
  tag_content:    String. The content of the tag. Can be simple or HTML string
  elm_attributes: Array of objects [{ attr_name, attr_value } ]
  example:
  get_HTML_element('div', 'some text',
    [
      { class: 'question' },
      { 'data-test': 'test value' },
      { click: functionName }
    ]
  )
*/
  function get_HTML_element(elm_tag_name, elm_content, elm_attributes) {

    // element
    var elm = document.createElement(elm_tag_name);

    // content
    if (typeof elm_content !== 'undefined') { elm.innerHTML = elm_content; }

    // attributes
    if (elm_attributes.length) {
      for (var i = 0; i < elm_attributes.length; i++) {
        for (var property in elm_attributes[i]) {
          if(property === 'click'){
            elm.addEventListener("click", elm_attributes[i][property]);
          } else {
            elm.setAttribute(property, elm_attributes[i][property]);
          }
        }
      }
    }
    return elm;
  }

  function assignCurrentItemInSet(items, itemIndex) {
    items.forEach((item, index) => {
      const shouldAddClass = index === itemIndex;
      item.classList.toggle(CLASS_CURRENT, shouldAddClass);
    });
  }

  function closePopup(e) {
    e.preventDefault();

    const popup = e.target.closest(`.${CLASS_POPUP}`);
    popup.classList.remove(CLASS_TOGGLED);
    popup.dataset.contentIndex = popupContentIndex;
    popupContentIndex = 0;

    const videos = popup.querySelectorAll('video');
    videos.forEach(video => video.pause());
  }

  function navigateContent (e, popupContents) {
    const clickedButton = e.target;
    if (clickedButton.classList.contains(CLASS_POPUP_PREVIOUS)) {
      popupContentIndex--;
    } else if (clickedButton.classList.contains(CLASS_POPUP_NEXT)) {
      popupContentIndex++;
    }
    assignCurrentItemInSet(popupContents, popupContentIndex);
  }

  function initPopupContent(popup) {

    const allContentElements = popup.querySelectorAll(`.${CLASS_CONTENT}`);
    const popupContents = Array.from(allContentElements).filter(content => content.parentElement === popup);
    const isMultiPage = popupContents.length>1;

    if (isMultiPage) {
      assignCurrentItemInSet(popupContents, popupContentIndex);
      popup.classList.add(CLASS_MULTI_PAGE_POPUP);
    } else {
      popupContents.forEach(popupContent => popupContent.classList.add(CLASS_CURRENT));
    }

    for(let i=0; i<popupContents.length;i++){
      
      let popupContent = popupContents[i];
      
      let btClosePopup = popupContent.querySelector(`.${CLASS_CLOSE_BUTTON}`);
      if (!btClosePopup) {
        btClosePopup = get_HTML_element('div','', [
          { class: CLASS_CLOSE_BUTTON },
          { click: closePopup }
        ]);
        popupContent.insertBefore(btClosePopup, popupContent.firstChild);
      }

      if(isMultiPage){
        if(i !== 0){ 
          // not the FIRST one. Aadd BACK button
          let btPrevious = popupContent.querySelector(`.${CLASS_POPUP_PREVIOUS}`);
          if (!btPrevious) {
            btPrevious = get_HTML_element('div','', [{ class: `${CLASS_POPUP_PREVIOUS } ${CLASS_POPUP_NAVIGATION}` }]);
            btPrevious.addEventListener('click', (e) => { navigateContent(e, popupContents); });
            popupContent.prepend(btPrevious);
          }   
        }
        if(i<popupContents.length - 1){ 
          // not the LAST one. add FORWARD button
          let btNext = popupContent.querySelector(`.${CLASS_POPUP_NEXT}`);
          if (!btNext) {
            btNext = get_HTML_element('div','', [{ class: `${CLASS_POPUP_NEXT} ${CLASS_POPUP_NAVIGATION}` }]);
            btNext.addEventListener('click', (e) => { navigateContent(e, popupContents); });
            popupContent.prepend(btNext);
          }   
        }
      }

    }
  }

  function initPopup(popup){ 
    if (popup.dataset.contentIndex) {
      popupContentIndex = parseInt(popup.dataset.contentIndex);
    }
    initPopupContent(popup);    
    popup.classList.add(CLASS_TOGGLED);
  }

  function openPopup(e) {
    e.preventDefault();
    const elm = e.target;
    initPopup(document.getElementById(elm.dataset.target));
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(`.${CLASS_OPEN_BUTTON}`).forEach(button => {
      button.addEventListener('click', openPopup);
    });
  });

})();
