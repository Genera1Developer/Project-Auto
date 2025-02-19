FILE PATH: public/js/proxy.js
CONTENT: 
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;

  fetch('/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
    .then((response) => response.json())
    .then((data) => {
      const pre = document.querySelector('pre');
      pre.textContent = data.html;
    })
    .catch((error) => {
      console.error('Error fetching proxy: ', error);
    });
});
```