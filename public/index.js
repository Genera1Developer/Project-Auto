FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  const method = document.querySelector('select[name="method"]').value;
  const body = document.querySelector('textarea[name="body"]').value;

  const requestBody = {
    url,
    method,
    body,
  };

  fetch('/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .then((data) => {
      document.querySelector('#result').innerHTML = data.content;
    })
    .catch((err) => {
      console.error(err);
    });
});
```