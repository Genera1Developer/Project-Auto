```javascript
// adblocker/curseblock.js

import { blockAds, unblockAds } from './adblocker.js';
import { observerMutation } from './adblocker/observer.js';

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
    console.log('Ad blocker is now disabled.');
  }
});
```