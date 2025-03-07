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
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        const seen = new WeakSet();

        function deepProxy(obj) {
            if (typeof obj !== 'object' || obj === null || seen.has(obj)) {
                return obj;
            }

            seen.add(obj);

            for (const prop in obj) {
                if (Object.hasOwn(obj, prop)) {
                    try {
                        obj[prop] = deepProxy(obj[prop]);
                    } catch (e) {
                        // ignore errors, some properties are read-only or not configurable
                    }
                }
            }

            return new Proxy(obj, handler);
        }

        return deepProxy(obj);
    }

    const safeProxy = (obj, handler) => {
        try {
            return new Proxy(obj, handler);
        } catch (e) {
            console.warn('Failed to create proxy for', obj, e);
            return obj;
        }
    }

    if (window.XMLHttpRequest) {
        window.XMLHttpRequest = safeProxy(window.XMLHttpRequest, handler);
    }
    if (window.WebSocket) {
        window.WebSocket = safeProxy(window.WebSocket, handler);
    }
    if (window.fetch) {
        window.fetch = safeProxy(window.fetch, handler);
    }
    if (window.navigator) {
        window.navigator = applyProxy(window.navigator, handler);
    }
    if (window.document) {
        window.document = applyProxy(window.document, handler);
    }
    if (window.history) {
        window.history = safeProxy(window.history, handler);
    }
    if (window.location) {
        window.location = safeProxy(window.location, handler);
    }

    //Hook iframe element creation to proxy their content windows if possible.
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'iframe') {
            element.addEventListener('load', () => {
                try {
                    if (element.contentWindow) {
                         applyProxy(element.contentWindow, handler);
                    }
                } catch (e) {
                    console.warn('Failed to proxy iframe contentWindow', e);
                }
            });
        }
        return element;
    };
})();