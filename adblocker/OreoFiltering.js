(async () => {
  const filterListUrl = "/adblocker/filters/easylist.txt";
  const elementTypes = new Set(["img", "script", "iframe", "object", "embed", "video", "audio", "source", "link", "style"]);
  const dataUrl = "data:,";
  let filters = [];
  let filterRegex = null;
  let filterUpdateInterval = 3600000;
  let blockedUrls = new Set();

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
      filterRegex = new RegExp(filters.join("|"), "i");
      console.log("[Adblocker] Filter list updated.");
    } catch (error) {
      console.error("Failed to update filters:", error);
    }
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
        removeElement(element);
        replaceUrl(element);
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeAdblocker);
  } else {
    initializeAdblocker();
  }
})();