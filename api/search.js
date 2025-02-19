Based on the project goal, here is the file:

FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const searchRouter = require('./api/search.js');

app.use('/api', searchRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```