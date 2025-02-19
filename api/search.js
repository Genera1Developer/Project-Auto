**Code for `api/search.js`:**

```javascript
const asyncHandler = require('./asyncHandler');
const handle500 = require('./handle500');
const proxy = require('./proxy');
const utility = require('./utility');

const search = asyncHandler(async (req, res) => {
  const { q: query, type } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  if (!['web', 'image', 'video', 'news'].includes(type)) {
    return res.status(400).json({ error: 'Invalid search type' });
  }

  const searchUrl = utility.buildSearchUrl(query, type);
  const transformer = utility.createTransformer(type);

  proxy
    .createRequest(searchUrl)
    .pipe(transformer)
    .pipe(res)
    .on('error', handle500(res));
});

module.exports = search;
```

## New Files

**`api/utility.js`**

```javascript
const createTransformer = (type) => {
  switch (type) {
    case 'web':
      return require('./transformers/web');
    case 'image':
      return require('./transformers/image');
    case 'video':
      return require('./transformers/video');
    case 'news':
      return require('./transformers/news');
    default:
      throw new Error('Invalid search type');
  }
};

const buildSearchUrl = (query, type) => {
  let url = `https://www.google.com/search?q=${query}`;

  switch (type) {
    case 'image':
      url += '&tbm=isch';
      break;
    case 'video':
      url += '&tbm=vid';
      break;
    case 'news':
      url += '&tbm=nws';
      break;
  }

  return url;
};

module.exports = {
  createTransformer,
  buildSearchUrl,
};
```

**`api/transformers/web.js`**

```javascript
const replaceUrls = require('./helpers/replaceUrls');

module.exports = replaceUrls(
  [
    'a[href]',
    'form[action]',
    'link[href]',
    'iframe[src]',
    'img[src]',
    'script[src]',
  ],
  (url) => `/api/proxy?url=${encodeURIComponent(url)}`
);
```

**`api/transformers/image.js`**

```javascript
const replaceUrls = require('./helpers/replaceUrls');

module.exports = replaceUrls(
  ['img[src]'],
  (url) => `/api/proxy?url=${encodeURIComponent(url)}`
);
```

**`api/transformers/video.js`**

```javascript
const replaceUrls = require('./helpers/replaceUrls');

module.exports = replaceUrls(
  ['iframe[src]', 'video[src]'],
  (url) => `/api/proxy?url=${encodeURIComponent(url)}`
);
```

**`api/transformers/news.js`**

```javascript
const replaceUrls = require('./helpers/replaceUrls');

module.exports = replaceUrls(
  [
    'a[href]',
    'form[action]',
    'link[href]',
    'iframe[src]',
    'img[src]',
    'script[src]',
  ],
  (url) => `/api/proxy?url=${encodeURIComponent(url)}`
);
```

**`api/helpers/replaceUrls.js`**

```javascript
const stream = require('stream');

const replaceUrls = (selectors, replaceFn) => {
  return new stream.Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      let html = chunk.toString();

      selectors.forEach((selector) => {
        html = html.replace(
          new RegExp(`${selector}="(.+?)"?`, 'g'),
          `${selector}="${replaceFn(RegExp.$1)}"`
        );
      });

      callback(null, html);
    },
  });
};

module.exports = replaceUrls;
```

## File Structure

```
📁 project
  ┣━━ 📂 api
    ┣━━ 📄 asyncHandler.js
    ┣━━ 📄 handle500.js
    ┣━━ 📄 proxy.js
    ┣━━ 📄 rewriteUrls.js
      ┣━━ 📄 createTransformer.js
      ┣━━ 📄 transformers
        ┣━━ 📄 image.js
        ┣━━ 📄 news.js
        ┣━━ 📄 video.js
        ┣━━ 📄 web.js
    ┣━━ 📄 search.js
    ┣━━ 📄 utility.js
      ┣━━ 📄 buildSearchUrl.js
      ┣━━ 📄 createTransformer.js
      ┣━━ 📄 helpers
        ┣━━ 📄 replaceUrls.js
  ┣━━ 📄 README.md
```