**File Structure:**

- `adblocker/curseblock.js` (entry point)
- `adblocker/adblocker.js` (ad blocking logic)
- `adblocker/observer.js` (DOM mutation observer)
- `adblocker/config.js` (configuration options)
- `adblocker/utils.js` (utility functions)
- `README.md` (project documentation)

**Improvements:**

**README.md:**

- Added a section on the DOM mutation observer.
- Included a code snippet for enabling the ad blocker in `pages/_app.js` or `index.js`.
- Updated the usage instructions to match the improved file structure.

**adblocker/adblocker.js:**

- Moved the DOM mutation observer initialization into a separate function called `startObserver()`.
- Imported the `startObserver()` function from `observer.js` to avoid circular dependencies.

**adblocker/observer.js:**

- Renamed the `observer` variable to `mutationObserver` for clarity.
- Created a new function called `startObserver()` that initializes the DOM mutation observer.

**New File: adblocker/toggle.js:**

- Created a new file for the ad blocker toggle functionality.
- Added a function called `toggleAdBlocker()` that enables or disables the ad blocker.

**Explanation:**

- Separating the ad blocker toggle functionality into a separate file improves the code organization and makes it easier to maintain.
- The `startObserver()` function allows for more flexibility in managing the DOM mutation observer.
- The `toggleAdBlocker()` function provides a clear and reusable way to enable or disable the ad blocker.

**Updated README.md:**

```
# Web Proxy for Vercel and Static Serverless Sites with Ad Blocking

## Goal

This project provides a comprehensive web proxy solution that works seamlessly with Vercel and static serverless sites, addresses bugs, ensures full functionality, and includes an integrated ad blocker.

## File Structure

- `adblocker/curseblock.js`: Entry point of the ad blocker.
- `adblocker/adblocker.js`: Contains functions for blocking and unblocking ads.
- `adblocker/observer.js`: Monitors DOM mutations for ad elements.
- `adblocker/config.js`: Configuration options for the ad blocker.
- `adblocker/utils.js`: Utility functions for element manipulation.
- `adblocker/toggle.js`: Controls the ad blocker toggle.
- `README.md`: Project documentation and usage instructions.

## Usage

To use the ad blocker, follow these steps:

1. Create a new Vercel or static serverless site.
2. Install the ad blocker package: `npm install vercel-web-proxy`
3. Add the following code to `pages/_app.js` or `index.js` of your site:

```
import { curseblock } from 'vercel-web-proxy';

curseblock();
```

4. Visit the deployed site and verify that ads are blocked.

## Configuration

The ad blocker can be configured using the following options:

- `adSelector`: CSS selector used to identify ad elements. Defaults to `.ad`.

## Features

- Blocks ads on Vercel and static serverless sites.
- Uses a DOM MutationObserver to monitor DOM changes for new ad elements.
- Provides an easy-to-use toggle to enable/disable the ad blocker.
- Configurable ad blocker state.
- Reusable utility functions for element manipulation.
- Separate ad blocker toggle functionality for improved code organization.

## DOM Mutation Observer

The ad blocker utilizes a DOM mutation observer to monitor the DOM for changes and block new ad elements as they appear. This ensures that ads are blocked even after the initial page load.

## Notes

- This ad blocker is specifically designed for Vercel and static serverless sites and may not work on other platforms.
- The ad blocker may require updates over time to address new ad-serving techniques.
- Please report any bugs or suggestions to contribute to the project's improvement.
```