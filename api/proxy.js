Based on the project goal, provide the file path and content in the following format:
FILE PATH: index.js
CONTENT: 
```javascript
const express = require('express');

const app = express();

app.use(express.static('public'));

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
```