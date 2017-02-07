# Popup
A flexible and easy to use js+css popup. At the moment it has three modes:

* **modal**: the popup comes with an overlay to block the other content. It is centered to the screen. The width, height and distance form top can be adjusted in the css (or scss) file.
* **in-place**: the popup will appear in the place the mouse is clicked (or touched). The popup will adjust itself to stay in the screen. Useful for in-place explanations, added details.
* **bottom**: the popup will appear in the bottom of the screen. The distance from the left side of the screen can be adjusted in the css (or scss) file.

## Usage
* Link to the css and the js files.
* Copy and paste the html
* **Do not** position the wrapper element (`.tPopup`) or the content (`.tPopupContent`). Use absolute positioning only on the *button* (items with the class `tBtOpenPopup`)

### Modal
```html
<div class="tPopup" data-type="modal">
<a class="tBtOpenPopup" href="#">Modal</a>
<div class="tPopupContent">
	<h1>This is the modal popup</h1>
	<p>To use it, apply <code>data-type="modal"</code> on the wrapper item (<code>.tPopup</code>)</p>
</div><!-- .tPopupContent -->
</div><!-- .tPopup -->
```

### In-place
```html
<div class="tPopup" data-type="inplace">
<a class="tBtOpenPopup" href="#">in-place</a>
<div class="tPopupContent">
	<h2>This is an inplace popup</h2>
	<p>To use it, apply <code>data-type="inplace"</code> on the wrapper item (<code>.tPopup</code>)</p>
</div><!-- .tPopupContent -->
</div><!-- .tPopup -->
```

### Bottom
```html
<div class="tPopup" data-type="bottom">
<a class="tBtOpenPopup" href="#">Bottom</a>
<div class="tPopupContent">
	<h2>This is the bottom popup</h2>
	<p>To use it, apply <code>data-type="bottom"</code> on the wrapper item (<code>.tPopup</code>)</p>
</div><!-- .tPopupContent -->
</div><!-- .tPopup -->
```