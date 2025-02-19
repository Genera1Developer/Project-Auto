FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');
const responseBody = document.querySelector('#response-body');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = event.target.querySelector('input[name="url"]').value;
  const method = event.target.querySelector('select[name="method"]').value;
  const requestBody = event.target.querySelector('textarea[name="request-body"]').value;

  const response = await fetch(url, {
    method,
    body: requestBody
  });

  const text = await response.text();

  responseBody.textContent = text;
});
```