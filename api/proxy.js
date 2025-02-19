FILE PATH: api/proxy.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();
const cors = require('cors');

const { getProxyData } = require('../model/proxy');

router.post('/', cors(), async (req, res) => {
  const { url, method, headers, body } = req.body;

  const data = await getProxyData(url, method, headers, body);

  res.json(data);
});

module.exports = router;
```