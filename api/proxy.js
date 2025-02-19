FILE PATH: controllers/proxy.js
CONTENT: 
```javascript
const fetch = require('node-fetch');
const FormData = require('form-data');

const getProxy = async (req, res) => {
  const { url, method, headers, body } = req.body;

  const formData = new FormData();

  formData.append('url', url);
  formData.append('method', method);
  formData.append('headers', JSON.stringify(headers));
  formData.append('body', body);

  try {
    const response = await fetch('http://localhost:8000/proxy', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProxy };
```