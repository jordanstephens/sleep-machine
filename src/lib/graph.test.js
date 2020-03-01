import graph, { rmap, normalize, redistribute } from './graph';

describe('rmap', () => {
  test('throws on undefined value', () => {
    expect(() => rmap(undefined, [7, 3], [1, 3])).toThrow('Invalid value');
  });

  test('throws on unordered src range', () => {
    expect(() => rmap(0, [7, 3], [1, 3])).toThrow('Invalid src Range');
  });

  test('throws on unordered dst range', () => {
    expect(() => rmap(0, [0, 10], [3, 1])).toThrow('Invalid dst Range');
  });

  test('throws on invalid src range', () => {
    expect(() => rmap(0, [3, 3], [0, 1])).toThrow('Invalid src Range');
  });

  test('throws on invalid dst range', () => {
    expect(() => rmap(0, [0, 1], [7, 7])).toThrow('Invalid dst Range');
  });

  test('is stable across an unchanged minimum', () => {
    expect(rmap(0, [0, 10], [0, 1])).toEqual(0);
  });

  test('is stable across an unchanged maximum', () => {
    expect(rmap(10, [0, 10], [5, 10])).toEqual(10);
  });

  test('is stable across an unchanged median', () => {
    expect(rmap(5, [0, 10], [0, 1])).toEqual(0.5);
  });

  test('is stable across an unchanged range', () => {
    expect(rmap(5, [0, 10], [0, 10])).toEqual(5);
  });

  test('maps a number from a src range to a smaller dst range', () => {
    expect(rmap(8, [0, 10], [0, 1])).toEqual(0.8);
  });

  test('maps a number from a src range to a larger dst range', () => {
    expect(rmap(0.8, [0, 1], [0, 10])).toEqual(8);
  });

  test('maps into a space which includes negative and positive numbers', () => {
    expect(rmap(1, [0, 5], [-1, 1])).toBeCloseTo(-0.6);
  });

  test('maps median to zero when dst space centers on zero', () => {
    expect(rmap(5, [0, 10], [-1, 1])).toBeCloseTo(0);
  });

  test('maps from positive to negative space', () => {
    expect(rmap(4, [0, 5], [-5, 0])).toEqual(-1);
  });
});

describe('normalize', () => {
  test('rmaps values in a vector to [0,1]', () => {
    const src = [1, 2, 3];
    const dst = normalize(src);
    expect(dst[0]).toBeCloseTo(0.33333);
    expect(dst[1]).toBeCloseTo(0.66666);
    expect(dst[2]).toBeCloseTo(1);
  });

  test('safely handles empty vectors', () => {
    const src = [];
    const dst = normalize(src);
    expect(dst).toEqual([]);
  });
});

describe('redistribute', () => {
  test('throws if vector length is < 2', () => {
    expect(() => redistribute([1], 0, -1)).toThrow('vector length must be greater than 1');
  });

  test('throws if index is out of bounds', () => {
    expect(() => redistribute([1, 0], 2, 1)).toThrow('index out of bounds');
  });

  test('throws if delta is out of bounds', () => {
    expect(() => redistribute([1, 0], 0, 2)).toThrow('delta out of bounds');
    expect(() => redistribute([1, 0], 0, -2)).toThrow('delta out of bounds');
  });

  test('throws if delta effects are out of bounds', () => {
    expect(() => redistribute([1, 0], 0, 1)).toThrow('delta effect out of bounds');
    expect(() => redistribute([1, 0], 1, -1)).toThrow('delta effect out of bounds');
  });

  test('swaps [1, 0] by adding 1 to 0', () => {
    const src = [1, 0];
    const dst = redistribute(src, 1, 1);
    expect(dst[0]).toBeCloseTo(0);
    expect(dst[1]).toBeCloseTo(1);
  });

  test('swaps [0, 1] by adding 1 to 0', () => {
    const src = [0, 1];
    const dst = redistribute(src, 0, 1);
    expect(dst[0]).toBeCloseTo(1);
    expect(dst[1]).toBeCloseTo(0);
  });

  test('swaps [1, 0] by subtracting 1 from 1', () => {
    const src = [1, 0];
    const dst = redistribute(src, 0, -1);
    expect(dst[0]).toBeCloseTo(0);
    expect(dst[1]).toBeCloseTo(1);
  });

  test('swaps [0, 1] by subtracting 1 from 1', () => {
    const src = [0, 1];
    const dst = redistribute(src, 1, -1);
    expect(dst[0]).toBeCloseTo(1);
    expect(dst[1]).toBeCloseTo(0);
  });

  test('swaps two values by adding the total to zero in the other direction', () => {
    const src = [0, 1];
    const dst = redistribute(src, 0, 1);
    expect(dst[0]).toBeCloseTo(1);
    expect(dst[1]).toBeCloseTo(0);
  });

  test('proportionally splits a value by adding half', () => {
    const src = [0, 1];
    const dst = redistribute(src, 0, 0.5);
    expect(dst[0]).toBeCloseTo(0.5);
    expect(dst[1]).toBeCloseTo(0.5);
  });

  test('proportionally splits a value by subtracting half', () => {
    const src = [0, 1];
    const dst = redistribute(src, 1, -0.5);
    expect(dst[0]).toBeCloseTo(0.5);
    expect(dst[1]).toBeCloseTo(0.5);
  });

  test('proportionally splits a value by adding a third', () => {
    const src = [0, 1];
    const dst = redistribute(src, 0, 0.33333);
    expect(dst[0]).toBeCloseTo(0.33333);
    expect(dst[1]).toBeCloseTo(0.66666);
  });

  test('proportionally splits a value by subtracting a third', () => {
    const src = [0, 1];
    const dst = redistribute(src, 1, -0.33333);
    expect(dst[0]).toBeCloseTo(0.33333);
    expect(dst[1]).toBeCloseTo(0.66666);
  });

  test('divides a value into many equal values', () => {
    const src = [0, 0, 0, 0, 0, 1];
    const dst = redistribute(src, 5, -0.5);
    expect(dst[0]).toBeCloseTo(0.1);
    expect(dst[1]).toBeCloseTo(0.1);
    expect(dst[2]).toBeCloseTo(0.1);
    expect(dst[3]).toBeCloseTo(0.1);
    expect(dst[4]).toBeCloseTo(0.1);
    expect(dst[5]).toBeCloseTo(0.5);
  });

  test('divides many equal values into one value', () => {
    const src = [0.2, 0.2, 0.2, 0.2, 0.2, 0];
    const dst = redistribute(src, 5, 0.5);
    expect(dst[0]).toBeCloseTo(0.1);
    expect(dst[1]).toBeCloseTo(0.1);
    expect(dst[2]).toBeCloseTo(0.1);
    expect(dst[3]).toBeCloseTo(0.1);
    expect(dst[4]).toBeCloseTo(0.1);
    expect(dst[5]).toBeCloseTo(0.5);
  });

  test('proportionally divides many values into one value', () => {
    const src = [0, 0.1, 0.2, 0.3, 0.4];
    const dst = redistribute(src, 0, 0.5);
    expect(dst[0]).toBeCloseTo(0.5);
    expect(dst[1]).toBeCloseTo(0.05);
    expect(dst[2]).toBeCloseTo(0.1);
    expect(dst[3]).toBeCloseTo(0.15);
    expect(dst[4]).toBeCloseTo(0.2);
  });

  test('proportionally divides one value into many values', () => {
    const src = [0.25, 0.25, 0.5];
    const dst = redistribute(src, 1, -0.25);
    expect(dst[0]).toBeCloseTo(0.25 + ((1 / 3) * 0.25));
    expect(dst[1]).toBeCloseTo(0);
    expect(dst[2]).toBeCloseTo(0.5 + ((2 / 3) * 0.25));
  });

  test('proportionally divides one value into many values', () => {
    const src = [0.25, 0.25, 0.5];
    const dst = redistribute(src, 1, 0.25);
    expect(dst[0]).toBeCloseTo(0.16666);
    expect(dst[1]).toBeCloseTo(0.5);
    expect(dst[2]).toBeCloseTo(0.33333);
  });
});
