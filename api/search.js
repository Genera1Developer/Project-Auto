file: server.js
content: 
```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const search = require('./api/search');

const app = express();

// Static
app.use('/static', express.static(path.join(__dirname, 'static')));

// API
app.use('/api', search);

// SPA
app.get('/*', (req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// Server
app.listen(3000);
```