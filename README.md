FILE PATH: server.js
CONTENT: 
```javascript
const http = require('http');
const request = require('request');

const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const url = req.body.url;

    request(url).pipe(res);
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Only POST requests are allowed.');
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```