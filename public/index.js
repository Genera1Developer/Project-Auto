FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  const method = document.querySelector('input[name="method"]').value;
  const body = JSON.stringify({
    name: 'John Doe',
  });

  const response = await fetch('/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  const responseBody = await response.text();

  console.log(responseBody);
});
```