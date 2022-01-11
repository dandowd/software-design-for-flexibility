import { AnyFunc } from "../common/function-types";

// Page 23
export function composeOne<T, O>(f: (output: O) => T, g: AnyFunc) {
  return (...args: T[]) => f(g(...args));
}

// Page 24 - the only difference is f has an indefinite arity
// If f is expecting an array as an argument, it will automatically be spread. This seems like an issue.
export function composeTwo<T, O extends any[]>(f: AnyFunc<any, T>, g: AnyFunc<any, O>) {
  return (...args: any[]) => (f(...g(...args)));
}

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
export function parallelCombine<T, P, O>(h: (one: P, two: O) => T, f: AnyFunc<any, P>, g: AnyFunc<any, O>) {
  return (...args: any[]) => h(f(args), g(args));
}

// Page 27
// Considered not a good implementation. 
// Combination does not have a well defined numerical arity. So it can't be passed to a function that needs it's arity.
export function spreadCombineOne<T, P, O>(h: (one: P, two: O) => T, f: (...args: any[]) => P, g: (...args: any[]) => O) {
  const fArity = f.length;

  const combination = (...args: any[]) => {
    const fArgs = args.slice(0, fArity);
    const gArgs = args.slice(fArity);

    return h(f(...fArgs), g(...gArgs));
  }

  return combination
}

// Helper function that cuts off any extra arguments.
// Not sure if this has much use in Javascript since functions can execute with extra args.
// export function restrictArity<T, O>(fn: (...args: T[]) => O, n: number) {
//   return (...args: T[]) => fn(...args.slice(0, n))
// }

// I'm not an expert in Scheme, but it looks like the book is using a global hash-table.
export function restrictArity(fn: AnyFunc, nargs: number) {
  const context = global || window as any;
  
  if (!context.arityTable) {
    context.arityTable = {
      [fn.name]: nargs
    }
  } else {
    context.arityTable = {
      ...context.arityTable,
      [fn.name]: nargs
    }
  }

  return (...args: any[]) => {
    if (args.length !== getArity(fn)) {
      throw new Error('Incorrect arity');
    }

    return fn(...args);
  };
}

export function getArity(fn: AnyFunc) {
  const context = global || window as any;

  if (!context.arityTable || !context.arityTable[fn.name]) {
    return fn.length;
  } 

  return context.arityTable[fn.name];
}

export function spreadCombineTwo(h: AnyFunc, f: AnyFunc, g: AnyFunc) {
  const n = getArity(f);
  const m = getArity(g);
  const t = n + m;

  const combination = (...args: any[]) => {
    const fArgs = args.slice(n);
    const gArgs = args.slice(n, m);

    return restrictArity(h(f(...fArgs), g(...gArgs)), t)
  }

  return combination
}