FILE PATH: server.js
CONTENT: 
```js
const express = require('express');
const app = express();

app.use(express.json());

const searchRoute = require('./routes/search');

app.use('/api', searchRoute);

app.listen(3000);
```