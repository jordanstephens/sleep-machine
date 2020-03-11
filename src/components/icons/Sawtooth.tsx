import React from 'react';
import classnames from 'classnames';

import { SIZE } from '../WeightedGraph/util'

interface IProps {
  className?: string;
}

const Sawtooth: React.FC<IProps> = ({ className }) => (
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={classnames('Sawtooth', className)}>
    <polygon points={`0,${SIZE} ${SIZE},0 ${SIZE}, ${SIZE}`} />
  </svg>
);

export default Sawtooth;
