const viewProxy = (fn) => new Proxy(fn, {
  apply: (target, _, args) => {
    console.log(`Function ${target.name} was called with args: ${args.toString()}`);
    return target.apply(this, args);
  },
});