## File Structure

- `README.md`
- `adblocker/ublock.js`
- `index.js`

## ublock.js

This file contains the logic for blocking ads on a web page.

- **Parse the filter lists**: This code loads the filter lists from the specified URLs and parses them to extract the blocking rules.
- **Observe the DOM for changes**: A MutationObserver is used to monitor changes to the DOM. When new elements are added to the page, the observer checks if they are ads and blocks them if necessary.
- **Blocking rules**: Blocking rules are a list of domains that are known to serve ads. If a request is made to a domain on this list, the request is blocked.
- **Blocking and unblocking ads**: The `blockAds()` function starts the ad-blocking process, and the `unblockAds()` function disables the ad-blocking.

## index.js

This file serves as the entry point for the web proxy.

- **Import the ublock.js file**: Import the `ublock.js` file to use its functionality for blocking ads.
- **Add middleware to the serverless function**: Add middleware to the serverless function to handle ad-blocking. This middleware will be called for every request that comes into the proxy.
- **Block ads for the response**: In the middleware, use the `ublock.js` module to block ads for the response.

## README.md

- Explain the purpose of the project.
- Describe the file structure.
- Provide instructions on how to use the web proxy.
- Include any troubleshooting tips.