file path: manifest.json
content: 
```js
{
  "manifest_version": 2,
  "name": "Web Proxy",
  "description": "A web proxy extension that blocks ads and provides additional privacy features.",
  "version": "1.0.0",

  "permissions": [
    "webRequest",
    "webRequestBlocking",
    "tabs",
    "storage",
    "contextMenus"
  ],

  "background": {
    "scripts": ["background.js"]
  },

  "browser_action": {
    "default_icon": "icon.png",
    "default_popup": "popup.html"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["adblocker/curseblock.js"],
      "css": ["styles.css"]
    }
  ],

  "contextMenus": [
    {
      "id": "unblock-ads",
      "title": "Unblock ads on this page",
      "contexts": ["page"]
    }
  ]
}
```