const viewProxy = (fn) => {
  return new Proxy(fn, {
    apply: (target, thisArg, argumentsList) => {
      console.log(`${target.name} was called with args: ${argumentsList}`);
      return target.apply(thisArg, argumentsList);
    },
  });
};