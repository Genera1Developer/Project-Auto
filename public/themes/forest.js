FILE PATH: public/themes/forest.js
CONTENT: 
```js
// Forest theme for the web proxy.

document.body.style.backgroundColor = "#00FF00";

document.getElementById("header").style.color = "#FFFFFF";
document.getElementById("footer").style.color = "#FFFFFF";

document.querySelectorAll("a").forEach(function(a) {
  a.style.color = "#FFFFFF";
});

document.querySelectorAll("button").forEach(function(button) {
  button.style.color = "#FFFFFF";
});
```