import React from 'react';
import { rel2abs } from './util';
import * as G from '../../lib/graph';

interface IEdgeProps {
  p1: G.Point;
  p2: G.Point;
}
const Edge: React.FC<IEdgeProps> = ({ p1, p2 }) => {
  const [x1, y1] = p1.map(rel2abs)
  const [x2, y2] = p2.map(rel2abs)
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      style={{ stroke: 'black' }}
      strokeWidth={0.25}
      strokeLinecap="round"
    />
  );
}

export default Edge;
