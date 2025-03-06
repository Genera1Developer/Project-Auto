(async () => {
  const filterListUrl = "/adblocker/filters/easylist.txt";
  const elementTypes = new Set(["img", "script", "iframe", "object", "embed", "video", "audio", "source", "link", "style"]);
  const dataUrl = "data:,";
  let filters = [];
  let filterRegex = null;
  let filterUpdateInterval = 3600000;
  let blockedUrls = new Set();
  let customFilters = new Set();
  let userSettings = {};

  async function loadFilters(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load filter list from ${url}: ${response.status}`);
      }
      const text = await response.text();
      return text.split("\n")
        .filter(line => line.trim() && !line.trim().startsWith("!"))
        .map(line => line
          .replace(/([.?+^$[\]\\(){}|-])/g, "\\$1")
          .replace(/\*/g, ".*?")
          .replace(/^@@\|\|/, ".*://")
          .replace(/^\|\|/, "^https?://")
          .replace(/^@@/, "^https?://(?!")
          .replace(/^\|/, "^")
          .replace(/\|$/, "$"));
    } catch (error) {
      console.error("Error loading or processing filter list:", error);
      return [];
    }
  }

  async function updateFilters() {
    try {
      filters = await loadFilters(filterListUrl);
      filters = filters.concat(Array.from(customFilters));
      filterRegex = new RegExp(filters.join("|"), "i");
      console.log("[Adblocker] Filter list updated.");
    } catch (error) {
      console.error("Failed to update filters:", error);
    }
  }

  function addCustomFilter(filter) {
    customFilters.add(filter);
    updateFilters();
  }

  function removeCustomFilter(filter) {
    customFilters.delete(filter);
    updateFilters();
  }

  function isBlocked(url) {
    if (blockedUrls.has(url)) {
      return true;
    }
    const blocked = filterRegex && filterRegex.test(url);
    if (blocked) {
      blockedUrls.add(url);
    }
    return blocked;
  }

  function removeElement(element) {
    element.remove();
  }

  function replaceUrl(element) {
    if (element.src) {
      element.src = dataUrl;
    }
    if (element.srcset) {
      element.srcset = dataUrl;
    }
    if (element.href) {
      element.href = dataUrl;
    }
  }

  function handleElement(element) {
    try {
      const url = new URL(element.src || element.srcset || element.href || "", location.href).href;
      if (isBlocked(url)) {
        if (userSettings.replaceBlockedContent) {
          replaceUrl(element);
        } else {
          removeElement(element);
        }
      }
    } catch (e) {
      console.warn("[Adblocker] Error processing element URL:", e);
    }
  }

  function handleBeforeLoad(event) {
    try {
      const url = new URL(event.detail.url || "", location.href).href;
      if (isBlocked(url)) {
        event.preventDefault();
      }
    } catch (e) {
      console.warn("[Adblocker] Error processing beforeLoad URL:", e);
    }
  }

  function applyFiltersToDocument() {
    const elements = document.querySelectorAll(elementTypes.size ? Array.from(elementTypes).join(",") : "*");
    elements.forEach(element => {
      if (element.tagName === 'SCRIPT') {
        const src = element.src || '';
        if (isBlocked(src)) {
          removeElement(element);
          return;
        }
      } else {
        handleElement(element);
      }
    });
  }

  function handleNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SCRIPT') {
        if (isBlocked(node.src)) {
          node.remove();
          return;
        }
      }
      handleElement(node);
    }
  }

  function observeDOM() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          handleNode(node);
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function proxyFetch() {
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = new Proxy(originalFetch, {
        apply: async function(target, thisArg, args) {
          const url = args[0];
          if (typeof url === 'string' && isBlocked(url)) {
            console.warn(`[Adblocker] Blocking fetch request to ${url}`);
            return Promise.reject(new Error(`Blocked by adblocker: ${url}`));
          }
          try {
            return await target.apply(thisArg, args);
          } catch (error) {
            console.error(`[Adblocker] Fetch error for ${url}:`, error);
            throw error;
          }
        }
      });
    }
  }

  function proxyXmlHttpRequest() {
    if (window.XMLHttpRequest) {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (isBlocked(url)) {
          console.warn(`[Adblocker] Blocking XMLHttpRequest to ${url}`);
          return;
        }
        return originalOpen.apply(this, arguments);
      };
    }
  }

  function proxyWindowOpen() {
    window.open = new Proxy(window.open, {
      apply: function(target, thisArg, args) {
        const url = args[0];
        if (isBlocked(url)) {
          console.warn(`[Adblocker] Blocking window.open to ${url}`);
          return null;
        }
        return target.apply(thisArg, args);
      }
    });
  }

  async function initializeAdblocker() {
    await updateFilters();
    applyFiltersToDocument();
    observeDOM();
    proxyFetch();
    proxyXmlHttpRequest();
    proxyWindowOpen();
    setInterval(updateFilters, filterUpdateInterval);

    window.addEventListener('message', (event) => {
      if (event.data.type === 'addCustomFilter') {
        addCustomFilter(event.data.filter);
      } else if (event.data.type === 'removeCustomFilter') {
        removeCustomFilter(event.data.filter);
      } else if (event.data.type === 'updateSettings') {
        userSettings = event.data.settings;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeAdblocker);
  } else {
    initializeAdblocker();
  }
})();
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Ad Blocker Settings</title>
</head>
<body>
    <h1>Ad Blocker Settings</h1>
    <label>
        Replace Blocked Content:
        <input type="checkbox" id="replaceBlockedContent">
    </label>
    <button id="saveSettings">Save Settings</button>

    <script src="settings.js"></script>
</body>
</html>
edit filepath: public/settings.js
content: document.getElementById('saveSettings').addEventListener('click', function() {
    const replaceBlockedContent = document.getElementById('replaceBlockedContent').checked;
    const settings = {
        replaceBlockedContent: replaceBlockedContent
    };
    
    window.parent.postMessage({ type: 'updateSettings', settings: settings }, '*');
    alert('Settings saved!');
});

window.addEventListener('message', function(event) {
    if (event.data.type === 'getSettings') {
        // Handle request for settings (if needed)
    }
});
edit filepath: public/adblocker_ui.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Ad Blocker UI</title>
</head>
<body>
    <h1>Ad Blocker Options</h1>
    <iframe src="settings.html" width="400" height="200"></iframe>
</body>
</html>
edit filepath: api/cache.js
content: const cache = {};

module.exports = {
  get: (key) => {
    return cache[key] || null;
  },
  set: (key, value) => {
    cache[key] = value;
  },
  clear: (key) => {
    delete cache[key];
  },
  clearAll: () => {
    for (const key in cache) {
      delete cache[key];
    }
  }
};