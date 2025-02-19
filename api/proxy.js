FILE PATH: routes/proxy.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();

const { getProxy } = require('../controllers/proxy');

router.post('/proxy', getProxy);

module.exports = router;
```