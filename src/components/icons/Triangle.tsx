import React from 'react';
import classnames from 'classnames';

import { SIZE, HALF } from '../WeightedGraph/util'

interface IProps {
  className?: string;
}

const Triangle: React.FC<IProps> = ({ className }) => (
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={classnames('Triangle', className)}>
    <polygon points={`0,${SIZE} ${HALF},0 ${SIZE}, ${SIZE}`} />
  </svg>
);

export default Triangle;
