import _ from 'lodash'

export const deg2rad = (deg: number) => (deg * Math.PI) / 180;

export type Vertex = number;
export type Point = [number, number, number];
export type Chart = Point[];
export type Vector = number[];
export type Matrix = Vector[];

export type Range = [number, number];
export function rmap(value: number, src: Range, dst: Range): number{
  if (value == null) throw new Error('Invalid value');
  const [smin, smax] = src;
  const [dmin, dmax] = dst;
  if (smin >= smax) throw new Error(`Invalid src Range: [${smin}, ${smax}]`);
  if (dmin >= dmax) throw new Error(`Invalid dst Range: [${dmin}, ${dmax}]`);
  return (value - smin) * (dmax - dmin) / (smax - smin) + dmin;
}

export function normalize_proportions(values: Vector = []) {
  if (!values.length) return [];
  const sum = _.sum(values);
  if (sum === 0) return values.map((v) => 0);
  const src: Range = [0, sum];
  const dst: Range = [0, 1];
  return values.map((value) => rmap(value, src, dst));
}
export function normalize_absolute(values: Vector = []) {
  if (!values.length) return [];
  const src: Range = [0, Math.max(...values)];
  const dst: Range = [0, 1];
  return values.map((value) => rmap(value, src, dst));
}

const EPSILON = 0.00005;
export function redistribute(values: Vector, index: number, delta: number) {
  if (index > values.length - 1) throw new Error('index out of bounds');
  if (delta < -1 || delta > 1) throw new Error('delta out of bounds');
  if (values.length < 2) throw new Error('vector length must be greater than 1');
  values.forEach((value) => {
    if (value < 0 || value > 1) {
      throw new Error('vector not normalized: value out of bounds');
    }
  })
  const sum = _.sum(values);
  if (sum < 1 - EPSILON || sum > 1 + EPSILON) {
    throw new Error(`vector not normalized: proportions sum to ${sum}`);
  }
  const pivot_0 = values[index];
  const pivot_1 = pivot_0 + delta;
  if (pivot_1 < 0 || pivot_1 > 1) {
    throw new Error('delta effect out of bounds');
  }
  const rem_0 = sum - pivot_0;
  const rem_1 = sum - pivot_1;
  // if rem_0 is zero, that means that the pivot was 100% of the value and the the differences needs to be equally distributed among the rest of the values
  if (rem_0 === 0) {
    // split the remainder up between each value except the pivot
    const value = rem_1 / (values.length - 1)
    return values.map((value_0, i) => (i === index) ? pivot_1 : value);
  }
  return values.map((value_0, i) => {
    if (i === index) return pivot_1;
    return value_0 + (-1 * delta * (value_0 / rem_0))
  })
}

export class Edge {
  a: Vertex;
  b: Vertex;

  constructor(a: Vertex, b: Vertex) {
    this.a = a;
    this.b = b;
  }

  equals(other: Edge) {
    return (this.a === other.a && this.b === other.b)
      || (this.a === other.b && this.b === other.a);
  }

  includes(x: Vertex) {
    return x === this.a || x === this.b;
  }
}

export class Graph {
  weights: number[];
  constructor(weights: number[]) {
    this.weights = weights;
  }

  get order(): number {
    return this.weights.length;
  }

  get normalized_weights(): number[] {
    return normalize_absolute(this.weights);
  }

  get vertices(): Vertex[] {
    return new Array(this.order).fill(0).map((x, i) => i)
  }

  get edges(): Edge[] {
    return _.chain(this.vertices)
      .map((v1) => this.vertices.map((v2) => v1 !== v2 && new Edge(v1, v2)))
      .flatten()
      .compact()
      .uniqBy(({ a, b }) => [a, b].sort().join(':'))
      .value();
  }

  chart(radius: number): Chart {
    return this.vertices.map((i) => {
      const theta = deg2rad((360 / this.order) * i);
      const x = radius * Math.sin(theta);
      const y = -1 * radius * Math.cos(theta);
      return [x, y, theta];
    })
  }
}

