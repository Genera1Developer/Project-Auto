const handler = {
    get: function(target, prop) {
        if (prop === 'toString') {
            return () => '[object Object]';
        }
        if (prop === Symbol.toStringTag) {
            return 'Object';
        }
        try {
            return Reflect.get(target, prop);
        } catch (e) {
            console.warn('Error getting property:', prop, 'on', target, e);
            return undefined;
        }
    },
    set: function(target, prop, value) {
        try {
            return Reflect.set(target, prop, value);
        } catch (e) {
            console.warn('Error setting property:', prop, 'on', target, 'to', value, e);
            return false;
        }
    },
    apply: function(target, thisArg, argumentsList) {
        try {
            return Reflect.apply(target, thisArg, argumentsList);
        } catch (e) {
            console.warn('Error applying function:', target, 'with args', argumentsList, 'and this', thisArg, e);
            return undefined;
        }
    },
    construct: function(target, argumentsList, newTarget) {
        try {
            return Reflect.construct(target, argumentsList, newTarget);
        } catch (e) {
            console.warn('Error constructing:', target, 'with args', argumentsList, 'and newTarget', newTarget, e);
            return undefined;
        }
    }
};

(() => {
    const applyProxy = (obj, handler) => {
        for (const prop in obj) {
            try {
                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                    obj[prop] = new Proxy(obj[prop], handler);
                } else if (typeof obj[prop] === 'function') {
                    // functions can be proxied, but it might break things
                }
            } catch (e) {
                // ignore errors, some properties are read-only or not configurable
            }
        }
        return new Proxy(obj, handler);
    }
    if (window.XMLHttpRequest) {
        window.XMLHttpRequest = new Proxy(window.XMLHttpRequest, handler);
    }
    if (window.WebSocket) {
        window.WebSocket = new Proxy(window.WebSocket, handler);
    }
    if (window.fetch) {
        window.fetch = new Proxy(window.fetch, handler);
    }
    if (window.navigator) {
        window.navigator = applyProxy(window.navigator, handler);
    }
    if (window.document) {
        window.document = applyProxy(window.document, handler);
    }
    if (window.history) {
        window.history = new Proxy(window.history, handler);
    }
    if (window.location) {
        window.location = new Proxy(window.location, handler);
    }
})();