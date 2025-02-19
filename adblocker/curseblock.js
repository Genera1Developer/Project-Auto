**File Structure:**

- `adblocker/curseblock.js` (entry point)
- `adblocker/adblocker.js` (ad blocking logic)
- `adblocker/observer.js` (DOM mutation observer)
- `adblocker/config.js` (configuration options)
- `adblocker/utils.js` (utility functions)
- `README.md` (project documentation)

**Improved adblocker/adblocker.js:**

```javascript
// adblocker/adblocker.js

import { removeElements, restoreElements } from './utils.js';
import { adSelector } from './config.js';
import { observer } from './observer.js';

// Block ads by removing elements matching the selector
export function blockAds() {
  const ads = document.querySelectorAll(adSelector);
  removeElements(ads);
}

// Unblock ads by restoring removed elements
export function unblockAds() {
  const hiddenAds = document.querySelectorAll('[data-vercel-web-proxy-hidden]');
  restoreElements(hiddenAds);
}

// Start observing the DOM for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

**Explanation:**

- Moved the DOM mutation observer initialization into the `adblocker.js` file for better organization.
- Imported the observer variable from `observer.js` to avoid circular dependencies.

**New File: adblocker/observer.js:**

```javascript
// adblocker/observer.js

import { adSelector } from './config.js';

// Create a DOM mutation observer to watch for new ad elements
export const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const newAds = mutation.addedNodes.querySelectorAll(adSelector);
      removeElements(newAds);
    }
  });
});
```

**Explanation:**

- Moved the ad selector import from `adblocker.js` to `observer.js` for cleaner code structure.

**README.md Updates:**

- Added a section on the DOM mutation observer.

**README.md:**

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

## DOM Mutation Observer

The ad blocker utilizes a DOM mutation observer to monitor the DOM for changes and block new ad elements as they appear. This ensures that ads are blocked even after the initial page load.

## Notes

- This ad blocker is specifically designed for Vercel and static serverless sites and may not work on other platforms.
- The ad blocker may require updates over time to address new ad-serving techniques.
- Please report any bugs or suggestions to contribute to the project's improvement.
```