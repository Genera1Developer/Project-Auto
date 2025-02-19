FILE PATH: routes/api.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();

router.use('/search', require('../api/search'));

module.exports = router;
```