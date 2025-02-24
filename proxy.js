const viewProxy = (fn) => new Proxy(fn, {
  get: (target, prop) => {
    if (typeof target[prop] === 'function') {
      return viewProxy(target[prop]);
    }
    return target[prop];
  },
  apply: (target, _, args) => {
    console.log(`Function ${target.name} was called with args: ${args.toString()}`);
    return target.apply(this, args);
  },
});