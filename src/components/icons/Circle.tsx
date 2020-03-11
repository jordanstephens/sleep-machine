import React from 'react';
import classnames from 'classnames';

import { SIZE, HALF } from '../WeightedGraph/util'

interface IProps {
  className?: string;
}

const Circle: React.FC<IProps> = ({ className }) => (
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={classnames('Circle', className)}>
    <circle cx={HALF} cy={HALF} r={HALF} />
  </svg>
);

export default Circle;
