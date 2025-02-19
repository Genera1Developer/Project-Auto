FILE PATH: api/index.js
CONTENT: 
```js
const express = require('express');
const router = express.Router();

router.use('/search', require('./search'));

module.exports = router;
```