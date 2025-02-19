Based on the project goal, a new file must be created:

FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');
const responseBody = document.getElementById('response-body');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const path = document.getElementById('path').value;
  const method = document.getElementById('method').value;
  const requestBody = document.getElementById('request-body').value;

  const response = await fetch(path, {
    method,
    body: requestBody,
  });

  const responseText = await response.text();
  responseBody.innerText = responseText;
});
```