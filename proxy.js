const viewProxy = (fn) => new Proxy(fn, {
  apply: (target, thisArg, argumentsList) => {
    console.log(`${target.name} was called with args: ${argumentsList.toString()}`);
    return target.apply(thisArg, argumentsList);
  },
});