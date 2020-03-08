import React from 'react';
import { rel2abs } from './util';
import * as G from '../../lib/graph';
import { Draggable } from '../Draggable';

function format_weight(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

interface IEdgeProps {
  id: string;
  p1: G.Point;
  p2: G.Point;
  weight: number;
}

const Edge: React.FC<IEdgeProps> = ({ id, p1, p2, weight }) => {
  const [x1, y1] = p1.map(rel2abs)
  const [x2, y2] = p2.map(rel2abs)
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
        style={{ stroke: 'black' }}
        strokeWidth={0.25}
        strokeLinecap="round"
        markerEnd="url(#arrow)"
      />
      {weight && (
        <g>
          <Draggable id={id} enabled={true}>
            <rect x={rect_x} y={rect_y} width={rect_w} height={rect_h} fill="white" />
            <text x={midpoint_x} y={midpoint_y} style={{ fontSize: 3, cursor: 'ns-resize', userSelect: 'none' }} dominantBaseline="middle" textAnchor="middle">
              {format_weight(weight)}
            </text>
          </Draggable>
        </g>
      )}
    </g>
  );
}

export default Edge;
