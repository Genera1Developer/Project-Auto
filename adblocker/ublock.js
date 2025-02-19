## File Structure

- `README.md`
- `adblocker/ublock.js`
- `config.js`
- `index.js`
- `package.json`
- `serverless.yml`
- `.env`
- `.gitignore`

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
export const proxyPatterns = [/^https:\/\/www.example.com\/.*/];
```