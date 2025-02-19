FILE PATH: public/index.js
CONTENT:
```javascript
const proxy = require('./proxy');

document.getElementById('submit').addEventListener('click', () => {
  const path = document.getElementById('path').value;
  const method = document.getElementById('method').value;
  const requestBody = document.getElementById('request-body').value;

  proxy[method](path, JSON.parse(requestBody), (data) => {
    document.getElementById('response-body').textContent = JSON.stringify(data);
  });
});
```