export type Vertex = number;
export type Point = [number, number, number];

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
