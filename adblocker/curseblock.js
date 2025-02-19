file: adblocker/adblocker.js

improve this file based on the project goal and suggest new files if necessary:

**Improved File Structure:**

- `adblocker/curseblock.js` (entry point)
- `adblocker/adblocker.js` (ad blocking logic)
- `adblocker/observer.js` (DOM mutation observer)
- `adblocker/config.js` (configuration options)
- `README.md` (project documentation)

**Improved adblocker/adblocker.js:**

```javascript
// adblocker/adblocker.js

import { removeElements } from './utils.js';
import { adSelector } from './config.js';

// Block ads by removing elements matching the selector
export function blockAds() {
  const ads = document.querySelectorAll(adSelector);
  removeElements(ads);
}

// Unblock ads by restoring removed elements
export function unblockAds() {
  const hiddenAds = document.querySelectorAll('[data-vercel-web-proxy-hidden]');
  hiddenAds.forEach((ad) => {
    ad.removeAttribute('data-vercel-web-proxy-hidden');
    ad.removeAttribute('style');
  });
}

```

**New File: adblocker/utils.js:**

```javascript
// adblocker/utils.js

// Remove elements from the DOM
export function removeElements(elements) {
  elements.forEach((element) => {
    element.setAttribute('data-vercel-web-proxy-hidden', true);
    element.style.display = 'none';
  });
}
```

**Explanation:**

- Improved the ad blocking mechanism by using a dedicated utility function for element removal.
- Extracted the ad selector into a separate configuration file for easier management.

**README.md Updates:**

- Updated the README to reflect the improved file structure and ad blocking mechanisms.

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
- Uses a MutationObserver to monitor DOM changes for new ad elements.
- Provides an easy-to-use toggle to enable/disable the ad blocker.
- Configurable ad blocker state.
- Reusable utility functions for element manipulation.

## Notes

- This ad blocker is specifically designed for Vercel and static serverless sites and may not work on other platforms.
- The ad blocker may require updates over time to address new ad-serving techniques.
- Please report any bugs or suggestions to contribute to the project's improvement.
```