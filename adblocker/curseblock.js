**Improved File Structure:**

- `adblocker/curseblock.js` (entry point)
- `adblocker/adblocker.js` (ad blocking logic)
- `adblocker/observer.js` (DOM mutation observer)
- `adblocker/config.js` (configuration options)
- `README.md` (project documentation)

**Improved adblocker/curseblock.js:**

```javascript
// adblocker/curseblock.js

import { blockAds, unblockAds } from './adblocker.js';
import { observerMutation, observerMutationStop } from './observer.js';
import { enabled } from './config.js';

// Initialize the ad blocker
blockAds();

// Add observer to DOM to monitor for ad elements
observerMutation();

// Toggle ad blocker state
const toggleBtn = document.getElementById('toggle-adblocker');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    enabled.set(!enabled.get());
    if (enabled.get()) {
      console.log('Ad blocker is now enabled.');
    } else {
      unblockAds();
      observerMutationStop();
      console.log('Ad blocker is now disabled.');
    }
  });
}
```

**New File: adblocker/config.js:**

```javascript
// adblocker/config.js

import { reactive } from 'vue';

// Ad blocker enabled state
export const enabled = reactive({ value: true });
```

**Explanation:**

- Introduced a configuration file to manage the ad blocker's enabled state.
- Added a toggle button to the UI for easier ad blocker control.
- Moved the `MutationObserver` logic to a dedicated `observer.js` file for better organization.
- Improved the logging messages for clarity.

**README.md Updates:**

- Added a section on configuration options.
- Clarified the usage instructions.
- Updated the project goal to reflect the improved functionality.

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

- `enabled`: Enable or disable the ad blocker. Defaults to `true`.

## Features

- Blocks ads on Vercel and static serverless sites.
- Uses a MutationObserver to monitor DOM changes for new ad elements.
- Provides an easy-to-use toggle to enable/disable the ad blocker.
- Configurable ad blocker state.

## Notes

- This ad blocker is specifically designed for Vercel and static serverless sites and may not work on other platforms.
- The ad blocker may require updates over time to address new ad-serving techniques.
- Please report any bugs or suggestions to contribute to the project's improvement.
```