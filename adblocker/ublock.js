## File Structure

- `README.md`
- `adblocker/ublock.js`
- `config.js`
- `index.js`
- `package.json`
- `serverless.yml`
- `.env`
- `.gitignore`

## Improved `adblocker/ublock.js`

```javascript
import { uBlockOrigin } from '@adblocked/ublockorigin';
import { filterLists, debug, proxyPatterns } from '../config';

const ublock = uBlockOrigin({
  filterLists,
  debug,
});

addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  // Check if the request should be proxied and processed for ad-blocking.
  if (!proxyPatterns.some((pattern) => pattern.test(requestUrl.hostname))) {
    event.respondWith(fetch(request));
    return;
  }

  const proxiedRequest = new Request(requestUrl.href, {
    headers: request.headers,
    mode: 'same-origin',
    credentials: 'same-origin',
  });

  ublock
    .requestFilter(proxiedRequest)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      const responseHeaders = new Headers();
      responseHeaders.append('Content-Type', response.headers.get('Content-Type'));
      event.respondWith(new Response(new Uint8Array(arrayBuffer), {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      }));
    })
    .catch((error) => {
      console.error(error);
      event.respondWith(fetch(request));
    });
});
```