Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: <file_path>
CONTENT: <file_content>

FILE PATH: api/proxy.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();
const search = require('./search');

router.post('/search', search);

module.exports = router;
```