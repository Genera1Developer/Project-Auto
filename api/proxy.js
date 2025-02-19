FILE PATH: model/proxy.js
CONTENT: 
```javascript
const fetch = require('node-fetch');

const getProxyData = async (url, method, headers, body) => {
  const formData = new FormData();

  formData.append('url', url);
  formData.append('method', method);
  formData.append('headers', JSON.stringify(headers));
  formData.append('body', body);

  const response = await fetch('http://localhost:8000/proxy', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  return data;
};

module.exports = { getProxyData };
```