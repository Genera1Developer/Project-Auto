FILE PATH: public/themes/light.js
CONTENT: 
```javascript
/* JavaScript to provide light mode functionality. */

// Set the document's body to have a white background color.
document.body.style.backgroundColor = "#FFFFFF";

// Set the text color of the header to black.
document.getElementById("header").style.color = "#000000";

// Set the text color of the footer to black.
document.getElementById("footer").style.color = "#000000";

// Set the text color of all links to black.
var links = document.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
  links[i].style.color = "#000000";
}

// Set the text color of all buttons to black.
var buttons = document.getElementsByTagName("button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].style.color = "#000000";
}
```