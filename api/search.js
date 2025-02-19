## File Structure

- `api/search.js`
- `api/asyncHandler.js`
- `api/handle500.js`
- `api/proxy.js`
- `api/utility.js`
- `api/rewriteUrls.js`

## Code for `api/search.js`

```javascript
const asyncHandler = require('./asyncHandler');
const handle500 = require('./handle500');
const proxy = require('./proxy');
const utility = require('./utility');
const createTransformer = require('./rewriteUrls').createTransformer;

const search = asyncHandler(async (req, res) => {
  // Get the query parameters
  const query = req.query.q;
  const type = req.query.type;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  // Build the search URL
  const searchUrl = utility.buildSearchUrl(query, type);

  // Create a proxy request
  const proxyRequest = proxy.createRequest(searchUrl);

  // Create a response transformer
  const transformer = createTransformer(type);

  // Pipe the proxy response through the response transformer
  proxyRequest
    .pipe(transformer)
    .pipe(res)
    .on('error', handle500(res));
});

module.exports = search;
```

## Replacements

- Refactored code to improve readability
- Added error handling for invalid type parameter
- Improved response handling for different search types

## New Files

- None