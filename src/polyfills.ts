// Lightweight polyfills to support older JS environments used during SSR/client
// Ensure these run before libraries that may use newer Array methods (e.g., MUI internals)
if (typeof Array.prototype.flat !== 'function') {
  // Minimal flat polyfill (depth = 1)
  // Note: intentionally simple to avoid heavy recursion/polyfill bloat
  // eslint-disable-next-line func-names
  Array.prototype.flat = function(depth: number = 1) {
    const result: any[] = [];
    (function flat(arr: any[], d: number) {
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (Array.isArray(el) && d > 0) {
          flat(el, d - 1);
        } else {
          result.push(el);
        }
      }
    })(this as any, depth);
    return result;
  };
}

if (typeof Array.prototype.flatMap !== 'function') {
  // Minimal flatMap polyfill using map + flat
  // eslint-disable-next-line func-names
  Array.prototype.flatMap = function(callback: any, thisArg?: any) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    const mapped = (this as any[]).map(function(this: any, ...args: any[]) {
      return callback.apply(thisArg, args);
    });
    // Use existing flat if available (we polyfilled above), default depth 1
    // @ts-ignore
    return (mapped as any).flat(1);
  };
}

  // Small dev-only confirmation so we can see if this file was executed.
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[polyfills] Array.flat / flatMap polyfills applied (if needed)');
  }

  export {};
