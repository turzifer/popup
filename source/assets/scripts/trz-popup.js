// /*  trzPopup.js 2.1.0 | (c) 2023-2024, turzifer. | turzifer.com */
// /*  A lightweight, vanilla JS popup library. Used with _trz-popup.scss */


(function(window) {
  'use strict';

  // Default configuration for CSS class names.
  // Users can override these via window.trzPopup.configure().
  let config = {
    toggled: "trz-toggled",
    current: "trz-current",
    popup: "trz-popup",
    content: "trz-content",
    openButton: "trz-bt-open-popup",
    closeButton: "trz-bt-close-popup",
    multiPagePopup: "trz-multi-page-popup",
    popupNavigation: "trz-popup-navigation",
    popupPrevious: "trz-popup-previous",
    popupNext: "trz-popup-next",
    autoInjectCloseButton: true,
    autoInjectNavButtons: true
  };

  // Expose configuration function on the window object.
  window.trzPopup = window.trzPopup || {};
  /**
   * Allows users to override default CSS class names.
   * Should be called before DOMContentLoaded for best results.
   * @param {object} userOptions - An object with class names to override.
   */
  window.trzPopup.configure = function(userOptions) {
    if (userOptions) {
      config = { ...config, ...userOptions };
    }
    // Note: If called after popups are initialized, existing event listeners
    // might still use old class names for querying. Best to call early.
  };

  let popupContentIndex = 0; // Tracks the current page index for multi-page popups.

  /**
   * Utility function to create an HTML element with specified tag, content, and attributes.
   * @param {string} elm_tag_name - The HTML tag name (e.g., 'div', 'button').
   * @param {string} elm_content - HTML string or text content for the element.
   * @param {Array<Object>} elm_attributes - Array of attribute objects, e.g., [{ class: 'my-class' }, { 'data-id': '123' }, { click: functionName }]
   *                                        'click' attribute is treated specially to add an event listener.
   * @returns {HTMLElement} The created HTML element.
   */
  function get_HTML_element(elm_tag_name, elm_content, elm_attributes) {

    // element
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

  /**
   * Toggles the CLASS_CURRENT on a set of items based on the provided itemIndex.
   * Used for managing active content in multi-page popups.
   * @param {NodeListOf<Element>|Array<Element>} items - A collection of elements.
   * @param {number} itemIndex - The index of the item to mark as current.
   */
  function assignCurrentItemInSet(items, itemIndex) {
    items.forEach((item, index) => {
      const shouldAddClass = index === itemIndex; // True if current iteration matches itemIndex
      item.classList.toggle(config.current, shouldAddClass); // Add/remove config.current accordingly
    });
  }

  /**
   * Closes the specified popup.
   * Handles ARIA attributes, focus restoration, and video pausing.
   * @param {Event} e - The event object, typically from a click on a close button.
   */
  function closePopup(e) {
    e.preventDefault();

    const popup = e.target.closest(`.${config.popup}`); // Find the parent popup element.
    // Restore focus to the element that opened the popup, if stored.
    if (popup.openingElement) { // openingElement is stored during openPopup
      popup.openingElement.focus();
      delete popup.openingElement; // Clean up the reference
    }
    popup.classList.remove(config.toggled); // Hide the popup
    popup.setAttribute('aria-hidden', 'true'); // Mark as hidden for screen readers
    popup.dataset.contentIndex = popupContentIndex; // Save current page index (mostly for multi-page)
    popupContentIndex = 0; // Reset page index for next time

    // Pause any videos within the popup to stop playback when closed.
    const videos = popup.querySelectorAll('video');
    videos.forEach(video => video.pause());

    // Make the main content wrapper visible again for screen readers.
    const mainWrapper = document.querySelector('.trz-wrapper') || document.body;
    mainWrapper.setAttribute('aria-hidden', 'false');
  }

  /**
   * Handles navigation between content sections in a multi-page popup.
   * @param {Event} e - The click event from a navigation button.
   * @param {Array<Element>} popupContents - Array of content elements for the current popup.
   */
  function navigateContent (e, popupContents) {
    const clickedButton = e.target;
    if (clickedButton.classList.contains(config.popupPrevious)) {
      popupContentIndex--; // Decrement index for previous page
    } else if (clickedButton.classList.contains(config.popupNext)) {
      popupContentIndex++; // Increment index for next page
    }
    // Update which content section has the config.current.
    assignCurrentItemInSet(popupContents, popupContentIndex);
  }

  /**
   * Initializes the content within a popup.
   * Sets up ARIA attributes, close buttons, and navigation for multi-page popups.
   * @param {HTMLElement} popup - The popup element to initialize content for.
   */
  function initPopupContent(popup) {

    // Find all elements with config.content directly under this popup.
    // This filter ensures we only get top-level content panes for this specific popup,
    // avoiding issues with nested popups having their own trz-content elements.
    const allContentElements = popup.querySelectorAll(`.${config.content}`);
    const popupContents = Array.from(allContentElements).filter(content => content.parentElement === popup);

    // Check if this popup should be treated as a multi-page popup.
    const isMultiPage = popupContents.length > 1;

    if (isMultiPage) {
      // If multi-page, set the initial current page (usually the first one, index 0).
      assignCurrentItemInSet(popupContents, popupContentIndex);
      popup.classList.add(config.multiPagePopup); // Add class to style multi-page container if needed.
    } else {
      // If single page, all its content sections (usually one) are marked as current.
      popupContents.forEach(popupContent => popupContent.classList.add(config.current));
    }

    // Iterate through each direct content section of the popup.
    // This loop is primarily for injecting close buttons and, if multi-page, navigation buttons.
    for(let i=0; i<popupContents.length;i++){
      
      let popupContent = popupContents[i]; // Current content section being processed.
      
      // Auto-inject close button if enabled in config.
      if (config.autoInjectCloseButton) {
        let btClosePopup = popupContent.querySelector(`.${config.closeButton}`);
        if (!btClosePopup) { // If no close button exists, create and prepend one.
          btClosePopup = get_HTML_element('div','', [
            { class: config.closeButton },
            { click: closePopup }, // Attach the closePopup event handler.
            { 'aria-label': 'Close popup' } // ARIA label for accessibility.
          ]);
          popupContent.insertBefore(btClosePopup, popupContent.firstChild);
        } else {
          // If button exists and auto-injection is on, ensure ARIA label is there.
          if (!btClosePopup.hasAttribute('aria-label')) {
            btClosePopup.setAttribute('aria-label', 'Close popup');
          }
        }
      }

      // Auto-inject navigation buttons for multi-page popups if enabled in config.
      if (isMultiPage && config.autoInjectNavButtons) {
        // Add "Previous" button if this is not the first content section (i > 0).
        if (i !== 0) {
          let btPrevious = popupContent.querySelector(`.${config.popupPrevious}`);
          if (!btPrevious) { // If no previous button exists, create and prepend one.
            btPrevious = get_HTML_element('div','', [{ class: `${config.popupPrevious} ${config.popupNavigation}` }]);
            // Attach event listener for navigating to the previous content.
            btPrevious.addEventListener('click', (e) => { navigateContent(e, popupContents); });
            popupContent.prepend(btPrevious); // Prepend to appear before content typically.
          }   
        }
        // Add "Next" button if this is not the last content section.
        if (i < popupContents.length - 1) {
          let btNext = popupContent.querySelector(`.${config.popupNext}`);
          if (!btNext) { // If no next button exists, create and prepend one.
            btNext = get_HTML_element('div','', [{ class: `${config.popupNext} ${config.popupNavigation}` }]);
            // Attach event listener for navigating to the next content.
            btNext.addEventListener('click', (e) => { navigateContent(e, popupContents); });
            popupContent.prepend(btNext); // Prepend to appear before content typically.
          }   
        }
      }
    }
    // Set ARIA labelledby for the popup using the first heading in the first content page.
    if (popupContents.length > 0) {
      const firstContent = popupContents[0];
      let titleId;
      const heading = firstContent.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleId = heading.id || popup.id + '_title'; // Use existing ID or generate one.
        if (!heading.id) {
          heading.id = titleId;
        }
        popup.setAttribute('aria-labelledby', titleId);
      }
    }
  }

  /**
   * Initializes a popup when it's opened.
   * Sets ARIA attributes, visibility, focus trapping, and initial focus.
   * @param {HTMLElement} popup - The popup element to initialize.
   */
  function initPopup(popup){ 
    // Restore content index if previously stored (e.g. for multi-page popups closed and reopened)
    if (popup.dataset.contentIndex) {
      popupContentIndex = parseInt(popup.dataset.contentIndex);
    }
    popup.setAttribute('tabindex', '-1'); // Allow popup to be programmatically focused.

    initPopupContent(popup); // Set up content, close buttons, nav, and ARIA for content.

    // Set ARIA attributes for the popup container itself.
    popup.setAttribute('aria-hidden', 'false'); // Mark as visible to screen readers.
    popup.setAttribute('role', 'dialog');       // Identify as a dialog.
    popup.setAttribute('aria-modal', 'true');    // Indicate it's a modal dialog.

    popup.classList.add(config.toggled); // Make the popup visible via CSS.

    // Hide the main content wrapper from screen readers while popup is open.
    const mainWrapper = document.querySelector('.trz-wrapper') || document.body;
    mainWrapper.setAttribute('aria-hidden', 'true');

    trapFocus(popup); // Initialize focus trapping within the popup.

    // Set initial focus inside the popup.
    // This is deferred until after trapFocus is set up and content is initialized.
    const currentContentForFocus = popup.querySelector(`.${config.content}.${config.current}`); // Target current page of multi-page.
    let elementToFocus = popup; // Default to focusing the popup container itself.
    if (currentContentForFocus) {
      const closeButton = currentContentForFocus.querySelector(`.${config.closeButton}`);
      if (closeButton) { // Prefer focusing the close button in the current content.
        elementToFocus = closeButton;
      }
    }
    // Ensure the chosen element is actually focusable (visible, not disabled, and has focus method).
    if(elementToFocus && typeof elementToFocus.focus === 'function' && elementToFocus.offsetParent !== null) {
        elementToFocus.focus();
    } else {
        // Fallback to the popup container if the preferred element isn't focusable.
        popup.focus();
    }
  }

  /**
   * Traps focus within the provided popup element.
   * Listens for Tab and Shift+Tab to cycle through focusable elements.
   * @param {HTMLElement} popupElement - The popup element to trap focus within.
   */
  function trapFocus(popupElement) {
    const focusableElementsString = 'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Initial query of focusable elements. This list is dynamically updated on each Tab event.
    let focusableElements = Array.from(popupElement.querySelectorAll(focusableElementsString));
    focusableElements = focusableElements.filter(el => el.offsetParent !== null); // Filter for visible elements.

    // If no visible focusable elements are found (besides potentially the popupElement itself),
    // further trapping logic might not be needed or might behave unexpectedly.
    // The popupElement itself should have tabindex="-1" to be programmatically focusable.
    if (focusableElements.length === 0 && !popupElement.matches('[tabindex="-1"]')) {
        return; // No elements to trap focus within, and popup itself is not focusable.
    }

    popupElement.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return; // Only interested in Tab key events.

      // Re-query focusable elements on each Tab press.
      // This accounts for changes in visibility (e.g., multi-page popups, dynamic content).
      let currentFocusableElements = Array.from(popupElement.querySelectorAll(focusableElementsString));
      currentFocusableElements = currentFocusableElements.filter(el => el.offsetParent !== null && !el.disabled); // Visible and not disabled.

      if (currentFocusableElements.length === 0) {
        // If, dynamically, no elements are focusable, prevent tabbing out by focusing popup itself (if focusable).
        if (popupElement.matches('[tabindex="-1"]')) popupElement.focus();
        e.preventDefault();
        return;
      }

      const currentActiveElement = document.activeElement;
      const firstFocusable = currentFocusableElements[0];
      const lastFocusable = currentFocusableElements[currentFocusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab (moving backwards)
        // If focus is on the first element (or the popup container itself), wrap to the last.
        if (currentActiveElement === firstFocusable || currentActiveElement === popupElement) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // Tab (moving forwards)
        // If focus is on the last element, wrap to the first.
        if (currentActiveElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  /**
   * Opens a popup based on the trigger element.
   * Stores the trigger for focus restoration and initializes the popup.
   * @param {Event} e - The event object from the trigger element.
   */
  function openPopup(e) {
    e.preventDefault();
    const triggerElement = e.target; // The element that triggered the popup.
    const targetId = triggerElement.dataset.target; // ID of the popup to open, from data-target attribute.

    if (!targetId) {
      console.error("Trigger element does not have a data-target attribute:", triggerElement);
      return;
    }
    const targetPopup = document.getElementById(targetId); // Find the popup element by ID.

    if (targetPopup) {
      targetPopup.openingElement = triggerElement; // Store the trigger for focus restoration on close.
      initPopup(targetPopup); // Initialize and display the popup.
      // Initial focus setting is handled within initPopup after content and trap is ready.
    } else {
      console.error(`Popup with ID '${targetId}' not found. Triggered by:`, triggerElement);
    }
  }

  // Initialize popups when the DOM is fully loaded.
  document.addEventListener("DOMContentLoaded", () => {
    // Find all elements intended to open popups.
    document.querySelectorAll(`.${config.openButton}`).forEach(button => {
      button.addEventListener('click', openPopup); // Attach openPopup listener to each.
    });
  });

  // Global keydown listener for "Escape" key to close active popups.
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') { // 'Esc' for older browser compatibility.
      // Find all currently visible popups.
      const activePopups = document.querySelectorAll(`.${config.popup}.${config.toggled}`);
      if (activePopups.length > 0) {
        // Target the last opened (topmost) popup.
        const topmostPopup = activePopups[activePopups.length - 1];

        // Attempt to find and click the close button within its current content.
        let closeButton = null;
        const currentContent = topmostPopup.querySelector(`.${config.content}.${config.current}`);
        if (currentContent) {
            closeButton = currentContent.querySelector(`.${config.closeButton}`);
        }

        if (closeButton) {
          closeButton.click(); // Programmatically click the close button.
        } else {
          // Fallback: if no close button in current content, try any close button in the popup.
          const anyCloseButton = topmostPopup.querySelector(`.${config.closeButton}`);
          if (anyCloseButton) {
            anyCloseButton.click();
          } else {
            // This should ideally not happen if popups are correctly initialized.
            console.warn("Could not find a close button to trigger for Escape key on popup:", topmostPopup);
          }
        }
      }
    }
  });

})(window);
