## File Structure

- `adblocker/ublock.js`
- `adblocker/ublock.worker.js`
- `service-worker.js`
- `package.json`
- `README.md`

## Raw Code for `ublock.js`

```javascript
import { uBlockOrigin } from '@adblocked/ublockorigin';
import { filterLists, debug, proxyPatterns } from '../config';

export const ublock = uBlockOrigin({
  filterLists,
  debug,
  cacheSize: 1000000, // Increase the cache size for better performance.
});
```

## Raw Code for `ublock.worker.js`

```javascript
import { uBlockOrigin } from '@adblocked/ublockorigin';
import { filterLists, debug, proxyPatterns } from '../config';

const ublockWorker = uBlockOrigin({
  filterLists,
  debug,
  cacheSize: 1000000, // Increase the cache size for better performance.
});
```

## Raw Code for `service-worker.js`

```javascript
addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (requestUrl.hostname === 'localhost') {
    event.respondWith(fetch(request));
    return;
  }

  const workerUrl = new URL('ublock.worker.js', requestUrl.href);
  workerUrl.searchParams.set('proxy', 'true');

  event.respondWith(
    fetch(workerUrl, {
      mode: 'same-origin',
      credentials: 'same-origin',
      cache: 'no-cache',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load worker: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const worker = new Worker(URL.createObjectURL(blob));
        worker.addEventListener('message', (event) => {
          if (event.data.type === 'proxy-response') {
            event.respondWith(new Response(event.data.body, {
              status: event.data.status,
              statusText: event.data.statusText,
              headers: event.data.headers,
            }));
          } else if (event.data.type === 'proxy-error') {
            event.respondWith(fetch(event.request));
          }
        });
        worker.postMessage({
          type: 'proxy-request',
          request: event.request,
        });
      })
      .catch((error) => {
        console.error(error);
        event.respondWith(fetch(request));
      })
  );
});
```

## Raw Code for `package.json`

```json
{
  "name": "adblocker",
  "version": "1.0.0",
  "description": "A web proxy with ad-blocking capabilities for Vercel and static serverless sites.",
  "license": "MIT",
  "scripts": {
    "build": "webpack",
    "start": "node server.js",
    "test": "jest",
    "deploy": "vercel deploy"
  },
  "dependencies": {
    "@adblocked/ublockorigin": "^1.0.0",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0"
  },
  "devDependencies": {
    "babel-core": "^7.0.0-bridge.0",
    "babel-loader": "^8.2.5",
    "babel-preset-env": "^7.18.2",
    "eslint": "^8.27.0",
    "eslint-config-airbnb-base": "^15.0.1",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-jsx-a11y": "^6.6.1",
    "jest": "^28.1.1",
    "webpack-dev-server": "^4.10.0"
  }
}
```

## New File: `README.md`

```markdown
# Adblocker Web Proxy

This project provides a web proxy with ad-blocking capabilities for Vercel and static serverless sites.

## Features

- Blocks ads using uBlock Origin.
- Supports multiple filter lists.
- Works with static serverless sites.
- Deploys easily to Vercel.

## Installation

1. Install the project dependencies:

```
npm install
```

2. Run the build script:

```
npm run build
```

3. Deploy the project to Vercel:

```
npm run deploy
```

## Usage

Once the project is deployed, you can use the proxy by visiting the following URL:

```
https://<your-project-name>.vercel.app/proxy
```

You can then browse the web as usual, and ads will be blocked automatically.

## Configuration

You can configure the proxy by editing the `config.js` file. The following options are available:

- `filterLists`: An array of filter lists to use.
- `debug`: A boolean value that enables debug logging.
- `proxyPatterns`: An array of patterns that should be proxied.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License.
```