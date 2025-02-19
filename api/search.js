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
const asyncHandler = require('./asyncHandler');

const proxyMiddleware = createProxyMiddleware({
  target: 'https://example.com',
  changeOrigin: true,
});

module.exports = asyncHandler(async (req, res) => {
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
    if (err) console.error(err);
  });

  // Pipe the response through the Transform stream
  res.pipe(transformStream).pipe(res);
});
```

## New File: `api/asyncHandler.js`

This file wraps the search handler in an async handler to catch any errors.

```js
const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
};

module.exports = asyncHandler;
```

## Enhancements

- Wrapped the search handler in an async handler for error handling.
- Moved the handling of 500 errors to the async handler to centralize error handling.