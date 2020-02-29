import _ from 'lodash'

export const deg2rad = (deg: number) => (deg * Math.PI) / 180;
export function normalize(values: number[]) {
  const min = 0,
    max = Math.max(...values);
  return values.map((value) => (value - min) / (max - min));
}

export type Vertex = number;
export type Point = [number, number, number];
export type Chart = Point[];

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
  order: number;
  constructor(order: number) {
    this.order = order;
  }

  get vertices(): Vertex[] {
    return new Array(this.order).fill(0).map((x, i) => i)
  }

  get edges(): Edge[] {
    return _.chain(this.vertices)
      .map((v1) => this.vertices.map((v2) => new Edge(v1, v2)))
      .flatten()
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

