FILE PATH: api/utils.js
CONTENT: 
```javascript
const axios = require('axios');

const getProxyUrl = (req) => {
  let url = req.protocol + '://' + req.get('host') + req.originalUrl;
  return url.replace('api/proxy', 'proxy');
};

const logRequest = (req) => {
  const url = getProxyUrl(req);
  const { method, headers, body } = req.body;
  console.log(`[${method}] ${url}`);
  console.log('headers:', headers);
  console.log('body:', body);
};

const forwardRequest = async (req, res) => {
  const url = getProxyUrl(req);
  try {
    const response = await axios({
      method: req.body.method,
      url,
      headers: req.body.headers,
      data: req.body.body,
    });

    res.status(response.status).send(response.data);
  } catch {
    res.status(500).send({ error: 'Something went wrong' });
  }
};

module.exports = {
  getProxyUrl,
  logRequest,
  forwardRequest,
};
```