FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');

const pathInput = document.querySelector('#path');
const methodInput = document.querySelector('#method');
const requestBodyInput = document.querySelector('#request-body');

const responseBodyElement = document.querySelector('#response-body');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const path = pathInput.value;
  const method = methodInput.value;
  const requestBody = requestBodyInput.value;

  const response = await fetch(`http://localhost:3000${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  const data = await response.json();
  responseBodyElement.textContent = JSON.stringify(data, null, 2);
});
```
FILE PATH: server/index.js
CONTENT:
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.all('*', async (req, res) => {
  const { method, url, body } = req;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```