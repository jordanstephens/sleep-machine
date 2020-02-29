import React from 'react';
import classnames from 'classnames'
import { rel2abs, NOOP } from './util';
import * as G from '../../lib/graph';

interface INodeProps {
  point: G.Point;
  radius: number;
  weight: number;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

const Node: React.FC<INodeProps> = ({ point, radius, weight, className, onClick = NOOP }) => {
  const [x, y] = point;
  return (
    <circle
      cx={rel2abs(x)}
      cy={rel2abs(y)}
      r={radius}
      className={classnames('vertex', className)}
      onClick={onClick}
      style={{
        transform: `scale(${weight})`,
        transformOrigin: `${rel2abs(x)}% ${rel2abs(y)}%`,
      }}
    />
  )
}

export default Node;
