export const SIZE = 100;
export const HALF = SIZE / 2;
export const NOOP = () => {};

export const rel2abs = (value: number) => HALF + value;

export interface IConfig {
  point_radius: number;
  label_offset: number;
  label_size: number;
  graph_radius: number;
}

export function generateConfig(point_radius: number, graph_radius: number): IConfig {
  return {
    point_radius,
    label_offset: point_radius * 2,
    label_size: point_radius * 0.8,
    graph_radius
  }
}
