FILE PATH: public/index.js
CONTENT:
```js
const form = document.querySelector('form');
const urlInput = document.querySelector('input[name="url"]');
const methodInput = document.querySelector('input[name="method"]');
const requestBodyInput = document.querySelector('textarea[name="request-body"]');
const responseBodyElement = document.getElementById('response-body');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = urlInput.value;
  const method = methodInput.value;
  const requestBody = requestBodyInput.value;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  const responseBody = await response.text();
  responseBodyElement.textContent = responseBody;
});
```