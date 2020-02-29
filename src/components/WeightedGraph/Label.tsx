import React from 'react';
import { rel2abs } from './util';
import * as G from '../../lib/graph';

interface ILabelProps {
  point: G.Point;
  offset: number;
  size: number;
  text: string;
}

const Label: React.FC<ILabelProps> = ({ point, offset, size, text }) => {
  const [x, y] = point;
  return (
    <text
      x={rel2abs(x + (Math.sign(x) * offset))}
      y={rel2abs(y + (Math.sign(y) * offset))}
      textAnchor="middle"
      dominantBaseline="middle"
      className="label"
      style={{ fontSize: size }}
    >
      {text}
    </text>
  )
}

export default Label;
