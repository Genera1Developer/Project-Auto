FILE PATH: public/main.js
CONTENT: 
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = document.querySelector('#url').value;
  const method = document.querySelector('#method').value;
  const headers = document.querySelector('#headers').value;
  const body = document.querySelector('#body').value;

  const request = {
    url,
    method,
    headers,
    body,
  };

  fetch('/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
});
```