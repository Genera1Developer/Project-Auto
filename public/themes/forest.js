FILE PATH: public/themes/forest.js
CONTENT: 
```javascript
// This file contains the JavaScript code for the forest theme.

function changeThemeToForest() {
  // Change the background color of the body.
  document.body.style.backgroundColor = "#388e3c";

  // Change the font family of the body.
  document.body.style.fontFamily = "Arial, sans-serif";

  // Change the color of all headings.
  var headings = document.getElementsByTagName("h1");
  for (var i = 0; i < headings.length; i++) {
    headings[i].style.color = "#ffffff";
  }

  // Change the color of all paragraphs.
  var paragraphs = document.getElementsByTagName("p");
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.color = "#ffffff";
  }

  // Change the color of all links.
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].style.color = "#ffffff";
    links[i].style.textDecoration = "none";
  }

  // Change the background color of the navigation bar.
  var nav = document.getElementsByTagName("nav");
  for (var i = 0; i < nav.length; i++) {
    nav[i].style.backgroundColor = "#2e7d32";
  }

  // Change the display of the navigation bar ul.
  var navUl = document.getElementsByTagName("nav ul");
  for (var i = 0; i < navUl.length; i++) {
    navUl[i].style.display = "flex";
    navUl[i].style.justifyContent = "space-between";
  }

  // Change the padding of the navigation bar li.
  var navLi = document.getElementsByTagName("nav li");
  for (var i = 0; i < navLi.length; i++) {
    navLi[i].style.padding = "10px";
  }

  // Change the color of the navigation bar a.
  var navA = document.getElementsByTagName("nav a");
  for (var i = 0; i < navA.length; i++) {
    navA[i].style.color = "#ffffff";
    navA[i].style.textDecoration = "none";
  }
}
```

FILE PATH: public/themes/desert.css
CONTENT: 
```css
/* This file contains the CSS code for the desert theme. */

body {
  background-color: #ffe4c4;
  font-family: Arial, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  color: #000000;
}

p {
  color: #000000;
}

a {
  color: #000000;
  text-decoration: none;
}

nav {
  background-color: #ffd166;
}

nav ul {
  display: flex;
  justify-content: space-between;
}

nav li {
  padding: 10px;
}

nav a {
  color: #000000;
  text-decoration: none;
}
```

FILE PATH: public/themes/desert.js
CONTENT: 
```javascript
// This file contains the JavaScript code for the desert theme.

function changeThemeToDesert() {
  // Change the background color of the body.
  document.body.style.backgroundColor = "#ffe4c4";

  // Change the font family of the body.
  document.body.style.fontFamily = "Arial, sans-serif";

  // Change the color of all headings.
  var headings = document.getElementsByTagName("h1");
  for (var i = 0; i < headings.length; i++) {
    headings[i].style.color = "#000000";
  }

  // Change the color of all paragraphs.
  var paragraphs = document.getElementsByTagName("p");
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.color = "#000000";
  }

  // Change the color of all links.
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].style.color = "#000000";
    links[i].style.textDecoration = "none";
  }

  // Change the background color of the navigation bar.
  var nav = document.getElementsByTagName("nav");
  for (var i = 0; i < nav.length; i++) {
    nav[i].style.backgroundColor = "#ffd166";
  }

  // Change the display of the navigation bar ul.
  var navUl = document.getElementsByTagName("nav ul");
  for (var i = 0; i < navUl.length; i++) {
    navUl[i].style.display = "flex";
    navUl[i].style.justifyContent = "space-between";
  }

  // Change the padding of the navigation bar li.
  var navLi = document.getElementsByTagName("nav li");
  for (var i = 0; i < navLi.length; i++) {
    navLi[i].style.padding = "10px";
  }

  // Change the color of the navigation bar a.
  var navA = document.getElementsByTagName("nav a");
  for (var i = 0; i < navA.length; i++) {
    navA[i].style.color = "#000000";
    navA[i].style.textDecoration = "none";
  }
}
```