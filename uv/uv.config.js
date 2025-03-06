(() => {
  "use strict";
  const uv = {
    prefix: "/service/",
    bare: "/bare/",
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: "/uv/uv.handler.js",
    bundle: "/uv/uv.bundle.js",
    config: "/uv/uv.config.js",
    sw: "/uv/uv.sw.js",
  };

  // Check if running in a service worker context
  if (typeof self !== 'undefined' && 'ServiceWorkerGlobalScope' in self) {
    self.uv = uv;
  } else {
    // Expose uv for non-service worker contexts (e.g., window)
    window.uv = uv;
  }
})();