file: api/search.js
content: 
```javascript
const express = require('express');

const router = express.Router();

router.get('/search', (req, res) => {
  const query = req.query.q;
  
  // Do something with the query...
  
  res.json({
    results: [
      {
        title: 'Example result',
        description: 'This is an example result'
      }
    ]
  });
});

module.exports = router;
```