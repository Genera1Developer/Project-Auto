file path: adblocker/curseblock.js
content: 
```js
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

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'IFRAME' || node.nodeName === 'IMG') {
        if (adServers.some((adServer) => node.src.includes(adServer))) {
          node.remove();
          console.log('Ad has been blocked:', node.src);
        }
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Adding a function to unblock ads
const unblockAds = () => {
  observer.disconnect();
  console.log('Ads are now unblocked.');
};

// Exporting the unblockAds function to make it accessible from other scripts
export { unblockAds };
```