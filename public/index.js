FILE PATH: public/index.js
CONTENT:
```javascript
import { createElement } from "./dom";

const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  const method = document.querySelector('input[name="method"]').value;
  const body = form.querySelector('textarea[name="body"]').value;

  const response = await fetch('/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, method, body }),
  });

  if (!response.ok) {
    const error = new Error(response.statusText);
    throw error;
  }

  const responseBody = await response.text();

  const result = createElement('pre', responseBody);
  document.querySelector('.result').appendChild(result);
});
```