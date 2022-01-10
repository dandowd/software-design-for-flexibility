// Page 23
export function composeOne<T, O>(f: (output: O) => T, g: (...args: any[]) => O) {
  return (...args: any[]) => f(g(...args));
}

// Page 24 - the only difference is f has an indefinite arity
// If f is expecting an array as an argument, it will automatically be spread. This seems like an issue.
export function composeTwo<T, O extends any[]>(f: (...args: any[]) => T, g: (...args: any[]) => O) {
  return (...args: any[]) => (f(...g(...args)));
}

// Simple function that allows the accumulation of results
export function identity(x: number) {
  return x;
}

// Page 25 - function iteration
export function iterateN(n: number, f: (m: number) => number): (acc: number) => number {
  if (n === 0) {
    return identity
  }

  return composeOne(f, iterateN(n - 1, f));
}

// Page 26
export function parallelCombine<T, P, O>(h: (one: P, two: O) => T, f: (...args: any[]) => P, g: (...args: any[]) => O) {
  return (...args: any[]) => h(f(args), g(args));
}

// Page 27
export function spreadCombineOne<T, P, O>(h: (one: P, two: O) => T, f: (...args: any[]) => P, g: (...args: any[]) => O) {
  const fArity = f.length;

  const combination = (...args: any[]) => {
    const fArgs = args.slice(0, fArity);
    const gArgs = args.slice(fArity);

    return h(f(...fArgs), g(...gArgs));
  }

  return combination
}