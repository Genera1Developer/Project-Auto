## File Structure

```
📁 project
  ┣━━ 📂 api
    ┣━━ 📄 asyncHandler.js
    ┣━━ 📄 handle500.js
    ┣━━ 📄 proxy.js
    ┣━━ 📄 rewriteUrls.js
    ┣━━ 📄 search.js
    ┣━━ 📄 utility.js
  ┣━━ 📄 README.md
```

## Code for `api/search.js`

```javascript
const asyncHandler = require('./asyncHandler');
const handle500 = require('./handle500');
const proxy = require('./proxy');
const utility = require('./utility');
const createTransformer = require('./rewriteUrls').createTransformer;

const search = asyncHandler(async (req, res) => {
  const { q: query, type } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  if (!['web', 'image', 'video', 'news'].includes(type)) {
    return res.status(400).json({ error: 'Invalid search type' });
  }

  const searchUrl = utility.buildSearchUrl(query, type);

  const transformer = createTransformer(type);

  proxy
    .createRequest(searchUrl)
    .pipe(transformer)
    .pipe(res)
    .on('error', handle500(res));
});

module.exports = search;
```

## Improvements

- Simplified the code by destructuring the query parameters.
- Moved the transformer creation logic into `rewriteUrls.js` for better organization.
- Updated the `utility.js` file to handle more generic URL building logic.
- Added error handling to the proxy request.