import React, { Fragment } from 'react';
import _ from 'lodash'
import classnames from 'classnames'
import './WeightedGraph.css';
import { Vertex, Edge, Point } from '../types';

const SIZE = 100;
const HALF = SIZE / 2;
const GRAPH_RADIUS = 33.33333;

const rel2abs = (v: number) => HALF + v;
interface ILabelProps {
  x: number;
  y: number;
  offset: number;
  size: number;
  text: string;
}

const Label: React.FC<ILabelProps> = ({ x, y, offset, size, text }) => (
  <text
    x={rel2abs(x + (Math.sign(x) * offset))}
    y={rel2abs(y + (Math.sign(y) * offset))}
    textAnchor="middle"
    dominantBaseline="middle"
    className="label"
    style={{
      fontSize: size
    }}
  >
    {text}
  </text>
)


interface INodeProps {
  x: number;
  y: number;
  radius: number;
  weight: number;
  className?: string;
}

const Node: React.FC<INodeProps> = ({ x, y, radius, weight, className }) => (
  <circle
    cx={rel2abs(x)}
    cy={rel2abs(y)}
    r={radius}
    className={classnames('vertex', className)}
    style={{
      transform: `scale(${weight})`,
      transformOrigin: `${rel2abs(x)}% ${rel2abs(y)}%`,
    }}
  />
)

interface IProps {
  labels?: string[];
  weights: number[];
  active?: Vertex;
  selected?: Edge;
}

const deg2rad = (deg: number) => (deg * Math.PI) / 180;
function normalize(xs: number[]) {
  const min = 0,
    max = Math.max(...xs);
  return xs.map((x) => (x - min) / (max - min));
}

const generate_vertices = (n: number): Vertex[] => new Array(n).fill(0).map((x, i) => i);
const generate_points = (n: number, vertices: Vertex[], radius: number): Point[] => vertices.map((i) => {
  const theta = deg2rad((360 / n) * i);
  const x = radius * Math.sin(theta);
  const y = -1 * radius * Math.cos(theta);
  return [x, y, theta];
});

const generate_edges = (vertices: Vertex[]): Edge[] => {
  return _.chain(vertices)
    .map((v1) => vertices.map((v2) => new Edge(v1, v2)))
    .flatten()
    .uniqBy(({ a, b }) => [a, b].sort().join(':'))
    .value();
};

const WeightedGraph: React.FC<IProps> = ({ labels = [], weights = [] }) => {
  const size = weights.length
  const point_radius = 5;
  const label_offset = point_radius * 2;
  const label_size = point_radius * 0.8;
  const vertices = generate_vertices(size);
  const points = generate_points(size, vertices, GRAPH_RADIUS);
  const edges = generate_edges(vertices);
  const active_weights = normalize(weights)
  return (
    <div className="WeightedGraph">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <g style={{
          transform: 'scale(1)',
          transformOrigin: '50% 50%'
        }}>
          {edges.map((edge, i) => {
            const { a, b } = edge;
            const [x1, y1] = points[a].map(rel2abs)
            const [x2, y2] = points[b].map(rel2abs)
            const [w1, w2] = [weights[a], weights[b]]
            if (w1 === 0 || w2 === 0) return null
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{ stroke: 'black' }}
                strokeWidth={0.25}
                strokeLinecap="round"
              />
            );
          })}
          {points.map(([x, y], i) => (
            <Fragment key={i}>
              <Label
                x={x}
                y={y}
                offset={label_offset}
                text={labels[i] || String(i)}
                size={label_size}
              />

              <Node
                x={x}
                y={y}
                radius={point_radius}
                weight={active_weights[i]}
                className="vertex"
              />
            </Fragment>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default WeightedGraph;
