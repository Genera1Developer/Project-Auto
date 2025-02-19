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
  - **proxy**: Handles incoming HTTP requests and applies ad-blocking to the response.
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
- **Scripts**:
  - **start**: Starts the Vercel/serverless proxy locally.

## config.js

**Purpose**: This file contains the configuration settings for the proxy.

- **Settings**:
  - **filterLists**: URLs of the filter lists to be used for ad-blocking.
  - **debug**: Enables or disables debug logging.

## .env

**Purpose**: This file stores the environment variables used by the proxy.

- **Variables**:
  - **FILTER_LISTS**: URLs of the filter lists.
  - **DEBUG**: Enables or disables debug logging.

## README.md

**Purpose**: Provides instructions and information about the proxy.

- **Instructions**: Explains how to deploy and use the proxy.
- **Features**: Describes the features and capabilities of the proxy.
- **Troubleshooting**: Offers tips for resolving common issues.