const view = (fn) => new Proxy(fn, {
  get: (target, prop) => (typeof target[prop] === 'function' ? view(target[prop]) : target[prop]),
  apply: (target, _, args) => {
    if (target.name) console.log(`Function ${target.name} called with args: ${args}`);
    return target(...args);
  },
});