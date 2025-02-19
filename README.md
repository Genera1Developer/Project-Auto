Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: src/server.js
CONTENT: 
```js
const express = require('express');
const app = express();
const PORT = 3000;
const { proxyRequest } = require('./proxy');

app.get('/:url', async (req, res) => {
    const url = decodeURIComponent(req.params.url);
    try {
        const data = await proxyRequest(url);
        res.send(data);
    } catch (error) {
        res.status(500).send('Error fetching data. Please try again.');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
```