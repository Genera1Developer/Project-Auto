FILE PATH: public/themes/forest.js
CONTENT: 
```javascript
/* JavaScript to provide forest mode functionality. */

// Set the document's body to have a green background color.
document.body.style.backgroundColor = "#008000";

// Set the text color of the header to white.
document.getElementById("header").style.color = "#FFFFFF";

// Set the text color of the footer to white.
document.getElementById("footer").style.color = "#FFFFFF";

// Set the text color of all links to white.
var links = document.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
  links[i].style.color = "#FFFFFF";
}

// Set the text color of all buttons to white.
var buttons = document.getElementsByTagName("button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].style.color = "#FFFFFF";
}
```