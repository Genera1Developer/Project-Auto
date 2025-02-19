FILE PATH: public/script.js
CONTENT: 
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

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
    .then((response) => response.json())
    .then((data) => {
      alert(data.response);
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
});
```