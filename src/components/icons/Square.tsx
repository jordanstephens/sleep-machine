import React from 'react';
import classnames from 'classnames';

import { SIZE } from '../WeightedGraph/util'

interface IProps {
  className?: string;
}

const Square: React.FC<IProps> = ({ className }) => (
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={classnames('Square', className)}>
    <rect x={0} y={0} height={SIZE} width={SIZE} />
  </svg>
);

export default Square;
