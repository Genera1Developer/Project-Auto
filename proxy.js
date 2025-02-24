const viewProxy = (fn) => 
  new Proxy(fn, {
    get: (target, prop) => typeof target[prop] === 'function' ? viewProxy(target[prop]) : target[prop],
    apply: (target, _, args) => { console.log(`Function ${target.name} was called with args: ${args}`); return target.apply(this, args); },
});