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
            return undefined;
        }
    },
    set: function(target, prop, value) {
        try {
            return Reflect.set(target, prop, value);
        } catch (e) {
            return false;
        }
    },
    apply: function(target, thisArg, argumentsList) {
        try {
            return Reflect.apply(target, thisArg, argumentsList);
        } catch (e) {
            return undefined;
        }
    },
    construct: function(target, argumentsList, newTarget) {
        try {
            return Reflect.construct(target, argumentsList, newTarget);
        } catch (e) {
            return undefined;
        }
    }
};

(() => {
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
        window.navigator = new Proxy(window.navigator, handler);
    }
    if (window.document) {
        window.document = new Proxy(window.document, handler);
    }
})();