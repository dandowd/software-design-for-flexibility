import { composeOne, composeTwo, iterateN, parallelCombine, restrictArity, spreadCombineOne } from "../combinators";

test('first compose should combine functions', () => {
  const sqr = (x: number): number => {
    return x * x;
  }

  const sum = (x: number, y: number): number => {
    return x + y;
  }

  const combined = composeOne(sqr, sum)(2,3);

  expect(combined).toBe(25);
});

test('composeTwo should allow indefinite arity in both functions', () => {
  const sum = (x: number, y: number): number => {
    return x + y
  }

  const sqrs = (x: number, y: number): number[] => {
    return [ x * x, y * y ];
  }

  const combined = composeTwo(sum, sqrs)(2, 3);

  expect(combined).toBe(13);
});

test('iterateN should iterate over function', () => {
  const square = (x: number) => x * x;

  const combined = iterateN(3, square)(5);
  
  expect(combined).toBe(390625)
});

// The simplicity of this test doesn't give a good sense of parallelCombine
// TODO: write a more robust test
test('parallel combine', () => {
  const food = {
    type: 'pizza',
    expirationDays: 0
  };

  const isEdible = (food) => {
    return food.type === 'pizza';
  }

  const isExpired = (food) => {
    return food.expirationDays;
  }

  const shouldEat = (isEdible: boolean, isExpired: boolean) => isEdible && !isExpired

  const combined = parallelCombine(shouldEat, isEdible, isExpired)(food);

  expect(combined).toBe(false);
});

test('spread combine one', () => {
  const h = (one: string, two: string) => one + " " + two;
  const f = (one: string) => one;
  const g = (one: string, two: string) => one + " " + two;

  const combined = spreadCombineOne(h, f, g)('fOne', 'gOne', 'gTwo');

  expect(combined).toBe('fOne gOne gTwo');
});

test('restrict arity should remove unused args', () => {
  const sum = (...args: number[]) => {
    return args.reduce((acc, n) => acc + n, 0);
  };

  const restricted = restrictArity(sum, 2)(2, 2, 2);
  
  expect(restricted).toBe(4)
});