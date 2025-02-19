FILE PATH: public/proxy.js
CONTENT:
```javascript
const fetch = require('node-fetch');

const proxy = (method, path, requestBody, callback) => {
  const url = `http://localhost:3000${path}`;

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .then((data) => callback(data))
    .catch((error) => callback(error));
};

module.exports = {
  get: (path, callback) => proxy('GET', path, null, callback),
  post: (path, requestBody, callback) => proxy('POST', path, requestBody, callback),
};
```