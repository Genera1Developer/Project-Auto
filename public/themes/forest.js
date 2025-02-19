FILE PATH: public/themes/forest.js
CONTENT: 
```js
// JS for forest mode.

/* Change the theme to forest mode. */
function setForestMode() {
  document.body.style.backgroundColor = "#417505";
  document.body.style.color = "#2e7d32";

  // Change the color of links.
  var links = document.querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    links[i].style.color = "#4caf50";
  }

  // Change the color of headings.
  var headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (var i = 0; i < headings.length; i++) {
    headings[i].style.color = "#2e7d32";
  }
}
```