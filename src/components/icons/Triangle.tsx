import React from 'react';
import classnames from 'classnames';

import { SIZE, HALF } from '../WeightedGraph/util'

interface IProps {
  className?: string;
  style?: object;
}

const Triangle: React.FC<IProps> = ({ className, ...props }) => (
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={classnames('Triangle', className)} {...props}>
    <polygon points={`0,${SIZE} ${HALF},0 ${SIZE},${SIZE}`} />
  </svg>
);

export default Triangle;
