
import React from 'react';
import classnames from 'classnames';

import { SIZE, HALF } from './WeightedGraph/util'
interface IProgressMeterProps {
  beat: number;
}

const PADDING = 4;

const ProgressMeter: React.FC<IProgressMeterProps> = ({ beat }) => (
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="ProgressMeter">
    {[0, 1, 3, 2].map((position, i) => (
      <rect
        className={classnames({
          on: beat === position
        })}
        x={i % 2 === 0 ? 0 : HALF + (PADDING / 2)}
        y={i < 2 ? 0 : HALF + (PADDING / 2)}
        height={HALF - (PADDING / 2)}
        width={HALF - (PADDING / 2)}
      />
    ))}
  </svg>
);

export default ProgressMeter;
