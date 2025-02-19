FILE PATH: api/proxy.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();
const utils = require('./utils.js');

router.post('/', async (req, res) => {
  utils.logRequest(req);
  await utils.forwardRequest(req, res);
});

module.exports = router;
```