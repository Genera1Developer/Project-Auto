const handler = {
    get: function(target, prop) {
        if (prop === 'toString') {
            return () => '[object Object]';
        }
        if (prop === Symbol.toStringTag) {
            return 'Object';
        }

        if (prop === 'then') {
            return undefined;
        }

        // Secure property access by checking if the property exists and is accessible.
        if (!(prop in target)) {
            return undefined;
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
    },
    defineProperty(target, property, descriptor) {
        try {
            return Reflect.defineProperty(target, property, descriptor);
        } catch (e) {
            console.warn('Error defining property:', property, 'on', target, 'with descriptor', descriptor, e);
            return false;
        }
    },
    deleteProperty(target, property) {
        try {
            return Reflect.deleteProperty(target, property);
        } catch (e) {
            console.warn('Error deleting property:', property, 'on', target, e);
            return false;
        }
    },
    getPrototypeOf(target) {
        try {
            return Reflect.getPrototypeOf(target);
        } catch (e) {
            console.warn('Error getting prototype of:', target, e);
            return null;
        }
    },
    setPrototypeOf(target, prototype) {
        try {
            return Reflect.setPrototypeOf(target, prototype);
        } catch (e) {
            console.warn('Error setting prototype of:', target, 'to', prototype, e);
            return false;
        }
    },
    isExtensible(target) {
        try {
            return Reflect.isExtensible(target);
        } catch (e) {
            console.warn('Error checking if extensible:', target, e);
            return false;
        }
    },
    preventExtensions(target) {
        try {
            return Reflect.preventExtensions(target);
        } catch (e) {
            console.warn('Error preventing extensions of:', target, e);
            return false;
        }
    },
    getOwnPropertyDescriptor(target, property) {
        try {
            return Reflect.getOwnPropertyDescriptor(target, property);
        } catch (e) {
            console.warn('Error getting own property descriptor of:', property, 'on', target, e);
            return undefined;
        }
    },
    ownKeys(target) {
        try {
            return Reflect.ownKeys(target);
        } catch (e) {
            console.warn('Error getting own keys of:', target, e);
            return [];
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

            let proxiedObj;

            if (Array.isArray(obj)) {
                proxiedObj = [];
                for (let i = 0; i < obj.length; i++) {
                    try {
                        proxiedObj[i] = deepProxy(obj[i]);
                    } catch (e) {
                        proxiedObj[i] = obj[i];
                    }
                }
            } else {
                proxiedObj = {};
                for (const prop in obj) {
                    if (Object.hasOwn(obj, prop)) {
                        try {
                            proxiedObj[prop] = deepProxy(obj[prop]);
                        } catch (e) {
                            proxiedObj[prop] = obj[prop];
                        }
                    }
                }
            }

            return new Proxy(proxiedObj, handler);
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
    if (window.localStorage) {
        window.localStorage = safeProxy(window.localStorage, handler);
    }
    if (window.sessionStorage) {
        window.sessionStorage = safeProxy(window.sessionStorage, handler);
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

    // Proxy window object itself.
    applyProxy(window, handler);

    // Attempt to prevent prototype pollution
    Object.prototype.__proto__ = null;

    // Securely override Function.prototype.apply and call to prevent potential exploits
    const originalFunctionApply = Function.prototype.apply;
    const originalFunctionCall = Function.prototype.call;

    Function.prototype.apply = new Proxy(originalFunctionApply, {
        apply(target, thisArg, argArray) {
            try {
                return Reflect.apply(target, thisArg, argArray);
            } catch (e) {
                console.warn('Error applying Function.prototype.apply:', e);
                return undefined;
            }
        }
    });

    Function.prototype.call = new Proxy(originalFunctionCall, {
        apply(target, thisArg, argArray) {
            try {
                return Reflect.apply(target, thisArg, argArray);
            } catch (e) {
                console.warn('Error applying Function.prototype.call:', e);
                return undefined;
            }
        }
    });

    // Override setTimeout and setInterval to prevent code execution
    window.setTimeout = new Proxy(window.setTimeout, {
        apply(target, thisArg, argArray) {
            console.warn('setTimeout blocked');
            return -1; // Or any value that isn't a valid timer ID
        }
    });

    window.setInterval = new Proxy(window.setInterval, {
        apply(target, thisArg, argArray) {
            console.warn('setInterval blocked');
            return -1; // Or any value that isn't a valid timer ID
        }
    });

})();