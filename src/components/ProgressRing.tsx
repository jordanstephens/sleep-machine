
import React from 'react';

import { SIZE, HALF, CIRCUMFERENCE } from './WeightedGraph/util'

interface IProgressRingProps {
  progress: number;
}

const ProgressRing: React.FC<IProgressRingProps> = ({ progress }) => {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <path
        className="progress"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE + progress * CIRCUMFERENCE}
        strokeWidth={0.5}
        fill="none"
        stroke="black"
        d={`M ${HALF}, ${HALF} m -${HALF}, 0 a ${HALF},${HALF} 0 1,0 ${SIZE},0 a ${HALF},${HALF} 0 1,0 -${SIZE},0`}
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', strokeLinecap: 'round' }}
      />
    </svg>
  )
}

export default ProgressRing;
