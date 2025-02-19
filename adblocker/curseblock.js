**File Structure:**

- `adblocker/curseblock.js`
- `adblocker/adblocker.js`
- `adblocker/observer.js`

**Improvements to adblocker/curseblock.js:**

```javascript
// adblocker/curseblock.js

import { blockAds, unblockAds } from './adblocker.js';
import { observerMutation, observerMutationStop } from './adblocker/observer.js';

// Initialize the ad blocker
blockAds();

// Add observer to DOM to monitor for ad elements
observerMutation();

// Enable/disable the ad blocker
document.getElementById('toggle-adblocker').addEventListener('click', () => {
  if (blockAds()) {
    console.log('Ad blocker is now enabled.');
  } else {
    unblockAds();
    observerMutationStop();
    console.log('Ad blocker is now disabled.');
  }
});
```

**New File: adblocker/observer.js:**

```javascript
// adblocker/observer.js

export function observerMutation() {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        blockAds();
      }
    });
  });

  const targetElement = document.querySelector('body');

  const config = {
    subtree: true,
    childList: true,
  };

  observer.observe(targetElement, config);
}

export function observerMutationStop() {
  if (typeof MutationObserver === 'undefined') return;
  const observer = new MutationObserver(() => {});

  const targetElement = document.querySelector('body');

  const config = {
    subtree: true,
    childList: true,
  };

  observer.disconnect();
  observer.observe(targetElement, config);
}
```

**Explanation:**

- The new `adblocker/observer.js` file contains the code to monitor DOM mutations for ad elements.
- `observerMutation()` function starts the mutation observer, which watches for changes in the DOM and calls `blockAds()` when new ad elements are detected.
- `observerMutationStop()` function stops the mutation observer when the ad blocker is disabled.
- The `toggle-adblocker` button now also stops the mutation observer when the ad blocker is disabled to prevent unnecessary processing.