FILE PATH: public/themes/forest.js
CONTENT: 
```js
// JavaScript to provide forest mode functionality.

// Changes the theme to forest mode.
function setForestTheme() {
  const body = document.querySelector('body');
  body.classList.add('forest');
}

// Listens for the click event on the forest theme button.
const forestButton = document.querySelector('#forest-theme-button');
forestButton.addEventListener('click', setForestTheme);
```