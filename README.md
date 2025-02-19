FILE PATH: client.js
CONTENT: 
```javascript
const request = require('request');

const proxyUrl = 'http://localhost:3000/proxy';

const getURL = (url, callback) => {
  request.post(proxyUrl, { json: { url } }, (error, response, body) => {
    if (error) {
      callback(error);
    } else {
      callback(null, body);
    }
  });
};

module.exports = {
  getURL,
};
```