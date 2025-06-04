# trz-popup

A flexible and easy-to-use JS+CSS popup library.

## Features

*   **Lightweight and Vanilla JS:** No external dependencies required.
*   **Basic Popups:** Display simple modal dialogs.
*   **Multi-Page Popups:** Create popups with internal navigation between multiple content sections.
*   **Nested Popups:** Open popups from within other popups.
*   **Dynamic Button Injection:** Close buttons and navigation arrows (for multi-page) are automatically added.
*   **Customizable Appearance:** Use CSS variables to easily theme popups to match your site.
*   **Accessibility Focused (WIP):** Ongoing improvements for ARIA attributes and keyboard navigation (details to be added as implemented).

## Usage

### 1. HTML Structure

You need a trigger element (button or any other element) and a popup container.

**Trigger Element:**
*   Add the class `trz-bt-open-popup`.
*   Add the `data-target` attribute with a value equal to the `id` of the popup container you want to open.

```html
<div class="trz-bt-open-popup" data-target="myPopup">Open Popup</div>
```

**Popup Container:**
*   The main container should have the class `trz-popup` and a unique `id`.
*   Inside the popup container, each section of content should be wrapped in a `div` with the class `trz-content`.

```html
<div class="trz-popup" id="myPopup">
    <!-- Single content section -->
    <div class="trz-content">
        <h2>My Awesome Popup</h2>
        <p>This is the content of the popup.</p>
        <!-- The close button will be auto-injected here -->
    </div>
</div>
```

### 2. CSS Classes Overview

*   `.trz-bt-open-popup`: Class for elements that trigger a popup.
*   `.trz-popup`: Main class for the popup container.
*   `.trz-content`: Class for individual content sections within a popup.
*   `.trz-toggled`: Added to the popup container when it's visible.
*   `.trz-current`: Added to the active `.trz-content` div (especially for multi-page popups).
*   `.trz-multi-page-popup`: Added to the popup container if it has multiple `.trz-content` children.
*   `.trz-bt-close-popup`: Class for the auto-injected close button.
*   `.trz-popup-navigation`: Base class for auto-injected navigation buttons.
*   `.trz-popup-previous`: Class for the "previous" navigation button.
*   `.trz-popup-next`: Class for the "next" navigation button.

### 3. JavaScript Initialization

The popup script (`trz-popup.js`) initializes automatically when the DOM is fully loaded. Just include the script in your HTML:

```html
<script src="path/to/your/assets/scripts/trz-popup.js"></script>
```

### 4. Examples

**Basic Popup:**
```html
<div class="trz-bt-open-popup" data-target="popup_basic">Open Basic Popup</div>
<div class="trz-popup" id="popup_basic">
    <div class="trz-content">
        <h2>Basic Popup Title</h2>
        <p>Some content here.</p>
    </div>
</div>
```

**Multi-Page Popup:**
To create a multi-page popup, simply add multiple `div.trz-content` elements directly inside the `div.trz-popup` container. Navigation buttons will be automatically generated.
```html
<div class="trz-bt-open-popup" data-target="popup_multipage">Open Multi-Page Popup</div>
<div class="trz-popup" id="popup_multipage">
    <div class="trz-content">
        <h2>Page 1</h2>
        <p>Content for the first page.</p>
    </div>
    <div class="trz-content">
        <h2>Page 2</h2>
        <p>Content for the second page.</p>
    </div>
</div>
```

**Nested Popups (Popup in Popup):**
You can place a trigger button (`.trz-bt-open-popup`) inside a `.trz-content` of another popup.
```html
<div class="trz-bt-open-popup" data-target="parentPopup">Open Parent Popup</div>
<div class="trz-popup" id="parentPopup">
    <div class="trz-content">
        <h2>Parent Popup</h2>
        <div class="trz-bt-open-popup" data-target="childPopup">Open Child Popup</div>
        <div class="trz-popup" id="childPopup">
            <div class="trz-content">
                <h2>Child Popup</h2>
                <p>This popup was opened from another popup.</p>
            </div>
        </div>
    </div>
</div>
```

## Customization

### CSS Variables
The appearance of the popups can be easily customized by overriding these CSS variables in your own stylesheet:
```css
:root {
  --popup-width: 50vw; /* Width of the popup content area */
  --popup-top-distance: 0; /* (Currently not used effectively in default styles, may need review) */
  --popup-padding: 1rem; /* Padding inside the popup content area */
  --overlay-bg-color: rgba(0, 0, 0, 0.85); /* Background color of the popup overlay */
  --popup-bg-color: white; /* Background color of the popup content area */
  --bt-close-bg-color: transparent; /* Background color of the close button */
}
```
Make sure to define these overrides *after* the main popup CSS is included.

### Button Icons/Styles
*   **Close Button:** The close button uses an SVG background image. You can change its appearance by targeting `.trz-bt-close-popup` in your CSS.
*   **Navigation Arrows:** The previous/next buttons for multi-page popups also use background images. Target `.trz-popup-previous` and `.trz-popup-next` to customize them.

## Development / Contribution

*   The core popup styles are written in SASS (`source/assets/styles/scss/_trz-popup.scss`) and compiled to `source/assets/styles/styles.css`.
*   `source/assets/scripts/scripts.js` is intended for any additional JavaScript for the demo page (`source/index.html`) and is not part of the core popup library.
*   Contributions for bug fixes, new features, or improvements are welcome! (Standard fork/PR process).
