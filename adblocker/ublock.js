## File Structure

- `README.md`
- `adblocker/ublock.js`
- `index.js`
- `serverless.yml`
- `package.json`
- `config.js`
- `.gitignore`

## ublock.js

This file contains the logic for blocking ads on a web page.

- **Parse the filter lists**: This code loads the filter lists from the specified URLs and parses them to extract the blocking rules.
- **Observe the DOM for changes**: A MutationObserver is used to monitor changes to the DOM. When new elements are added to the page, the observer checks if they are ads and blocks them if necessary.
- **Blocking rules**: Blocking rules are a list of domains that are known to serve ads. If a request is made to a domain on this list, the request is blocked.
- **Blocking and unblocking ads**: The `blockAds()` function starts the ad-blocking process, and the `unblockAds()` function disables the ad-blocking.

## index.js

This file serves as the entry point for the web proxy.

- **Import the ublock.js file**: Import the `ublock.js` file to use its functionality for blocking ads.
- **Import the config.js file**: Import the `config.js` file to access the configuration settings.
- **Add middleware to the serverless function**: Add middleware to the serverless function to handle ad-blocking. This middleware will be called for every request that comes into the proxy.
- **Block ads for the response**: In the middleware, use the `ublock.js` module to block ads for the response.

## serverless.yml

This file defines the serverless function that will run the web proxy.

- **Functions**: Defines the `proxy` function that will handle incoming requests.
- **Events**: Configures the proxy function to be triggered by HTTP requests.
- **Environment Variables**: Specifies the environment variables that will be available to the proxy function.

## package.json

This file specifies the dependencies for the project.

- **Dependencies**: The `ublock-js` dependency is used for blocking ads.
- **Scripts**: The `start` script is used to run the web proxy locally.

## config.js

This file contains the configuration settings for the web proxy.

- **filterLists**: Specifies the URLs of the filter lists to be used for ad-blocking.
- **debug**: Enables or disables debug logging.

## README.md

- Explains the purpose of the project.
- Describes the file structure.
- Provides instructions on how to use the web proxy.
- Includes any troubleshooting tips.

## .gitignore

- Specifies the files and directories that should be ignored by Git.