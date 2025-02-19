file path: adblocker/curseblock.js
content: 
```js
// Array of known ad server domains
const adServers = [
  'doubleclick.net',
  'adx.g.doubleclick.net',
  'ads.google.com',
  'yieldmanager.com',
  'pubmatic.com',
  'openx.net',
  'rubiconproject.com',
  'rhythmone.com',
  'aol.com',
  'criteo.com',
];

// MutationObserver to detect and remove ad elements
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'IFRAME' || node.nodeName === 'IMG') {
        if (adServers.some((adServer) => node.src.includes(adServer))) {
          node.remove();
          console.log('Ad blocked:', node.src);
        }
      }
    }
  }
});

// Start observing the DOM for ad elements
observer.observe(document.body, { childList: true, subtree: true });

// Function to unblock ads
const unblockAds = () => {
  observer.disconnect();
  console.log('Ads unblocked.');
};

// Export the unblockAds function
export { unblockAds };
```