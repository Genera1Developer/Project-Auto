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

**Purpose**: This file contains the code for blocking ads on the client side.

- **Functions**:
  - **ParseFilterLists**: Loads the filter lists from the specified URLs and parses them to extract the blocking rules.
  - **observeDomChanges**: Observes the DOM for changes and blocks ads when new elements are added to the page.
  - **blockAds**: Starts the ad-blocking process.
  - **unblockAds**: Disables the ad-blocking process.

## index.js

**Purpose**: This file contains the main logic for the Vercel/serverless proxy.

- **Functions**:
  - **proxy**: Handles incoming HTTP requests, applies ad-blocking to the response if the request URL matches specific patterns, and supports other features like static site serving and API routing.
  - **importUblock**: Imports the `ublock.js` module and initializes the ad-blocking functionality.
  - **importConfig**: Imports the `config.js` file and loads the configuration settings.

## serverless.yml

**Purpose**: This file defines the serverless function and its configuration.

- **Functions**:
  - **proxy**: Defines the proxy function that handles incoming requests.

## package.json

**Purpose**: This file specifies the dependencies and scripts for the project.

- **Dependencies**:
  - **ublock-js**: Dependency for ad-blocking.
  - **body-parser**: Dependency for parsing HTTP request bodies.
  - **express**: Dependency for creating a web server and handling HTTP requests.
  - **serverless-http**: Dependency for deploying the proxy as a serverless function on platforms like Vercel.
- **Scripts**:
  - **start**: Starts the Vercel/serverless proxy locally.
  - **deploy**: Deploys the proxy to Vercel or other serverless platforms.

## config.js

**Purpose**: This file contains the configuration settings for the proxy.

- **Settings**:
  - **filterLists**: URLs of the filter lists to be used for ad-blocking.
  - **debug**: Enables or disables debug logging.
  - **proxyPatterns**: An array of URL patterns that specify which requests should be proxied and processed for ad-blocking.
  - **staticSiteDir**: The directory where static site files are located (if applicable).
  - **apiRoutes**: An object that defines API routes and their associated handlers (if applicable).

## .env

**Purpose**: This file stores the environment variables used by the proxy.

- **Variables**:
  - **FILTER_LISTS**: URLs of the filter lists.
  - **DEBUG**: Enables or disables debug logging.
  - **PROXY_PATTERNS**: Array of URL patterns for proxying and ad-blocking.
  - **STATIC_SITE_DIR**: Directory where static site files are located.
  - **API_ROUTES**: JSON object defining API routes and handlers.

## README.md

**Purpose**: Provides instructions and information about the proxy.

- **Instructions**: Explains how to deploy and use the proxy, including configuration and customization options.
- **Features**: Describes the features and capabilities of the proxy, such as ad-blocking, static site serving, and API routing.
- **Troubleshooting**: Offers tips for resolving common issues and provides guidance for debugging and customization.