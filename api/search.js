## File Structure

```
├── api
│   ├── proxy.js
│   ├── search.js
│   ├── utility.js
├── README.md
```

## Improved Code for `api/search.js`

```js
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Transform } = require('stream');
const utility = require('./utility');

const proxyMiddleware = createProxyMiddleware({
  target: 'https://example.com',
  changeOrigin: true,
});

module.exports = function (req, res) {
  // Ensure response type is set to HTML
  req.headers['accept'] = 'text/html';

  // Create a Transform stream to rewrite relative URLs
  const transformStream = new Transform({
    transform: (chunk, encoding, next) => {
      const modifiedChunk = utility.modifyChunk(chunk, 'relativeUrls');
      next(null, modifiedChunk);
    },
    flush: (next) => {
      next(null, '</body></html>');
    },
  });

  // Proxy the request through the middleware
  proxyMiddleware(req, res, (err) => {
    if (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>Internal Server Error</h1>');
      return;
    }

    // Pipe the response through the Transform stream
    res.pipe(transformStream).pipe(res);
  });
};
```

## New File: `api/utility.js`

This file contains utility functions.

```js
const utility = {
  modifyChunk: (chunk, type) => {
    if (type === 'relativeUrls') {
      return chunk.toString().replace(/="(\/.*?)"/g, '="$1?proxy');
    }
  },
};

module.exports = utility;
```

## Enhancements

- Created a `utility.js` file to separate utility functions.
- Refactored the code to make it more DRY and reusable.
- Used a utility function to modify relative URLs, making it easier to extend the functionality in the future.