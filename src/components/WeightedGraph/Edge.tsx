import React from 'react';
import classnames from 'classnames'
import { rel2abs, POINT_RADIUS } from './util';
import * as G from '../../lib/graph';
import { Draggable } from '../Draggable';

function format_weight(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

function slope(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  if (dx === 0) return Infinity;
  return (y2 - y1) / dx
}

function point_at_distance(x0: number, y0: number, slope: number, distance: number): [number, number] {
  if (slope === 0) return [x0 + distance, y0];
  if (slope === Infinity) return [x0, y0 + distance];
  // https://www.geeksforgeeks.org/find-points-at-a-given-distance-on-a-line-of-given-slope
  const partial = (distance * Math.sqrt(1 / (1 + Math.pow(slope, 2))))
  return [x0 + partial, y0 + (slope * partial)]
}

function endpoints(p1: G.Point, p2: G.Point): [number, number, number, number] {
  const d = POINT_RADIUS + 2
  const [x1, y1] = p1.map(rel2abs);
  const [x2, y2] = p2.map(rel2abs);
  const m = slope(x1, y1, x2, y2);
  const sign = Math.sign(m)
  const desc = (m === 0 && x2 > x1)
    || (m === Infinity && y2 > y1)
    || (sign === 1 && x2 > x1)
    || (sign === -1 && x2 > x1)
  const [d1, d2] = desc ? [d, -d] : [-d, d]
  const [x1a, y1a] = point_at_distance(x1, y1, m, d1);
  const [x2a, y2a] = point_at_distance(x2, y2, m, d2);
  return [x1a, y1a, x2a, y2a];
}

interface IEdgeProps {
  id: string;
  p1: G.Point;
  p2: G.Point;
  weight?: number;
  selected?: boolean;
}

const Edge: React.FC<IEdgeProps> = ({ id, p1, p2, weight, selected }) => {
  const [x1, y1, x2, y2] = endpoints(p1, p2);
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.max(x1, x2) - x;
  const height = Math.max(y1, y2) - y;
  const midpoint_x = x + (width / 2);
  const midpoint_y = y + (height / 2);
  const rect_w = 8;
  const rect_h = 4;
  const rect_x = midpoint_x - (rect_w / 2);
  const rect_y = midpoint_y - (rect_h / 2);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={classnames('edge', {
          selected: !!selected
        })}
        strokeLinecap="round"
        markerEnd={selected ? 'url(#selected-arrow)' : 'url(#arrow)'}
      />
      {weight && (
        <g>
          <Draggable id={id} enabled={true}>
            <rect x={rect_x} y={rect_y} width={rect_w} height={rect_h} className="weight-box" />
            <text x={midpoint_x} y={midpoint_y} className="weight-label" style={{ fontSize: 3, cursor: 'ns-resize', userSelect: 'none' }} dominantBaseline="middle" textAnchor="middle">
              {format_weight(weight)}
            </text>
          </Draggable>
        </g>
      )}
    </g>
  );
}

export default Edge;
