(() => {
  const handler = {
    get: function(target, prop) {
      if (prop === 'toString') {
        return () => '[object Object]';
      }
      if (prop === Symbol.toStringTag) {
        return 'Object';
      }
      return target[prop];
    }
  };

  window.XMLHttpRequest = new Proxy(window.XMLHttpRequest, handler);
  window.WebSocket = new Proxy(window.WebSocket, handler);

  if (window.fetch) {
    window.fetch = new Proxy(window.fetch, handler);
  }

  if (window.navigator) {
    window.navigator = new Proxy(window.navigator, handler);
  }

  if (window.document) {
    window.document = new Proxy(window.document, handler);
  }
})();