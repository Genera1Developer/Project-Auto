FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = document.querySelector('#url').value;
  const method = document.querySelector('#method').value;
  const body = document.querySelector('#body').value;

  const requestBody = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  fetch(url, requestBody)
    .then((res) => res.text())
    .then((data) => {
      const result = document.querySelector('.result');
      result.textContent = data;
    })
    .catch((err) => {
      console.error(err);
      const result = document.querySelector('.result');
      result.textContent = `Error: ${err.message}`;
    });
});
```