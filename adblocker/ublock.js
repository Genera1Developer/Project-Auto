## File Structure

- `README.md`
- `adblocker/ublock.js`
- `index.js`
- `serverless.yml`
- `package.json`
- `config.js`
- `.env`
- `.gitignore`

## ublock.js

```javascript
// ParseFilterLists loads the filter lists from the specified URLs and parses them to extract the blocking rules.
export function ParseFilterLists(filterLists) {
  const rules = [];
  for (const filterList of filterLists) {
    const response = await fetch(filterList);
    const text = await response.text();
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.startsWith('||')) {
        const rule = line.substring(2).split('^');
        rules.push({
          domain: rule[0],
          path: rule[1],
        });
      }
    }
  }
  return rules;
}

// observeDomChanges observes the DOM for changes and blocks ads when new elements are added to the page.
export function observeDomChanges(rules) {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType === Node.ELEMENT_NODE) {
          const element = addedNode as HTMLElement;
          for (const rule of rules) {
            if (element.hostname === rule.domain && element.pathname.startsWith(rule.path)) {
              element.remove();
            }
          }
        }
      }
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

// blockAds starts the ad-blocking process.
export function blockAds(rules) {
  ParseFilterLists(rules).then(parsedRules => {
    observeDomChanges(parsedRules);
  });
}

// unblockAds disables the ad-blocking process.
export function unblockAds() {
  observer.disconnect();
}
```

## index.js

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import importUblock from './adblocker/ublock';
import importConfig from './config';

const app = express();

// Import and initialize ad-blocking functionality.
importUblock();

// Import configuration settings.
const config = importConfig();

// Proxy requests handled by the proxy.
app.use((req, res, next) => {
  for (const pattern of config.proxyPatterns) {
    if (req.url.match(pattern)) {
      res.setHeader('Content-Type', 'text/html');
      res.write(`<!DOCTYPE html><html><head><title>Proxy Server</title><body><h1>Request proxied</h1><pre>${JSON.stringify(req.headers, null, 2)}</pre><pre>${req.method} ${req.url}</pre><pre>${JSON.stringify(req.body, null, 2)}</pre></body></html>`);
      res.end();
      return;
    }
  }

  // Static file serving or API routing can be added here based on the configuration.

  next();
});

// Start the proxy.
app.listen(3000, () => {
  console.log(`Proxy server listening on port 3000`);
});
```

## serverless.yml

```yaml
functions:
  proxy:
    handler: index.handler
```

## package.json

```json
{
  "name": "proxy-server",
  "version": "1.0.0",
  "description": "A web proxy server with ad-blocking capabilities.",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "deploy": "vercel deploy --prebuilt"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "serverless-http": "^3.1.0",
    "ublock-js": "^1.1.0"
  }
}
```

## config.js

```javascript
// Filter lists to be used for ad-blocking.
export const filterLists = [
  'https://easylist.to/easylist/easylist.txt',
  'https://easylist.to/easylist/easyprivacy.txt',
];

// Enable or disable debug logging.
export const debug = false;

// Proxy patterns specify which requests should be proxied and processed for ad-blocking.
export const proxyPatterns = [/^https:\/\/www\.example\.com\/.*$/];

// Directory where static site files are stored, if used.
export const staticSiteDir = './static';

// API routes and associated handlers, if used.
export const apiRoutes = {
  '/api/hello': (req, res) => {
    res.json({ message: 'Hello world!' });
  },
};
```

## .env

```env
FILTER_LISTS=https://easylist.to/easylist/easylist.txt,https://easylist.to/easylist/easyprivacy.txt
DEBUG=false
PROXY_PATTERNS=/^https:\/\/www\.example\.com\/.*$/
```