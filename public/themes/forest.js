FILE PATH: public/themes/forest.js
CONTENT: 
```javascript
// JavaScript for forest mode.

// Change the background color of the body to green.
document.body.style.backgroundColor = "#417505";

// Change the color of the text to white.
document.body.style.color = "#2e7d32";

// Change the color of the links to green.
var links = document.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
  links[i].style.color = "#4caf50";
}
```