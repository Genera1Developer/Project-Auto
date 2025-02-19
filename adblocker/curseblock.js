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

// Function to show blocked ad count
const showBlockedAdCount = () => {
  const blockedAds = document.querySelectorAll('div[data-blocked-ad]');
  console.log(`Total ads blocked: ${blockedAds.length}`);
};

// Function to create a custom HTML element to indicate blocked ads
const createBlockedAdIndicator = (element) => {
  const indicator = document.createElement('div');
  indicator.setAttribute('data-blocked-ad', true);
  indicator.style.position = 'absolute';
  indicator.style.top = '0';
  indicator.style.left = '0';
  indicator.style.width = '100%';
  indicator.style.height = '100%';
  indicator.style.background = 'rgba(255, 0, 0, 0.5)';
  indicator.style.zIndex = '999999';
  element.appendChild(indicator);
};

// MutationObserver to detect and mark blocked ads
const blockedAdObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'IFRAME' || node.nodeName === 'IMG') {
        if (adServers.some((adServer) => node.src.includes(adServer))) {
          createBlockedAdIndicator(node.parentElement);
        }
      }
    }
  }
});

// Start observing the DOM for blocked ads
blockedAdObserver.observe(document.body, { childList: true, subtree: true });

// Export the unblockAds and showBlockedAdCount functions
export { unblockAds, showBlockedAdCount };
```