FILE PATH: api/search.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();

router.get('/search', (req, res) => {
  const query = req.query.q;
  const results = search(query);
  res.json(results);
});

module.exports = router;
```