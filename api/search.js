Based on the project goal, the following file should be created:

FILE PATH: index.js
CONTENT: 
```javascript
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```