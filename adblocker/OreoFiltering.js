(() => {
  const filterListUrl = "/adblocker/filters/easylist.txt";
  const elementTypes = new Set(["img", "script", "iframe", "object", "embed", "video", "audio", "source", "link", "style"]);
  const dataUrl = "data:,";
  let filters = [];
  let filterRegex = null;
  const filterUpdateInterval = 3600000;
  const blockedUrls = new Set();
  const customFilters = new Set();
  let initialized = false;

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
      const currentFilters = Array.from(customFilters);
      const loadedFilters = await loadFilters(filterListUrl);
      filters = loadedFilters.concat(currentFilters);
      filterRegex = new RegExp(filters.join("|"), "i");
      console.log("[Adblocker] Filter list updated.");
      blockedUrls.clear();
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
    if (!filterRegex) return false;
    if (blockedUrls.has(url)) return true;
    const blocked = filterRegex.test(url);
    if (blocked) blockedUrls.add(url);
    return blocked;
  }

  function removeElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function replaceUrl(element) {
    try {
      if (element.src) element.src = dataUrl;
      if (element.srcset) element.srcset = dataUrl;
      if (element.href) element.href = dataUrl;
    } catch (e) {
      console.warn("[Adblocker] Error replacing URL:", e);
    }
  }

  function handleElement(element) {
    if (!element) return;

    try {
      let url;
      if (element.src) {
        url = new URL(element.src, location.href).href;
      } else if (element.srcset) {
        url = new URL(element.srcset, location.href).href;
      } else if (element.href) {
        url = new URL(element.href, location.href).href;
      } else {
        return;
      }

      if (isBlocked(url)) {
        removeElement(element);
        replaceUrl(element);
      }
    } catch (e) {
      console.warn("[Adblocker] Error processing element:", element, e);
    }
  }

  function handleBeforeLoad(event) {
    try {
      if (!event.detail || !event.detail.url) return;
      const url = new URL(event.detail.url, location.href).href;
      if (isBlocked(url)) {
        event.preventDefault();
      }
    } catch (e) {
      console.warn("[Adblocker] Error processing beforeLoad event:", e);
    }
  }

  function applyFiltersToDocument() {
    const elements = document.querySelectorAll(elementTypes.size ? Array.from(elementTypes).join(",") : "*");
    elements.forEach(element => {
      if (element.tagName === 'SCRIPT') {
        const src = element.src || '';
        if (isBlocked(src)) {
          removeElement(element);
        }
      } else {
        handleElement(element);
      }
    });
  }

  function handleNode(node) {
    if (!node) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SCRIPT') {
        if (node.src && isBlocked(node.src)) {
          removeElement(node);
        }
      } else {
        handleElement(node);
      }
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
    if (initialized) return;
    initialized = true;
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
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeAdblocker);
  } else {
    initializeAdblocker();
  }
})();