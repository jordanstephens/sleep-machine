import React from 'react';
import { Params } from '../lib/machine'
import ProgressMeter from './ProgressMeter';

interface IControlsProps {
  beat: number;
  params: Params;
  onChange: (params: Params) => void;
}

const Controls: React.FC<IControlsProps> = ({ beat, params, onChange }) => {
  return (
    <form className="Controls">
      <div style={{ display: 'flex' }}>
        <ProgressMeter beat={beat} />
        <input
          type="number"
          name="tempo"
          value={params.tempo}
          onChange={(event) => onChange({
            tempo: parseInt(event.target.value, 10)
          })}
        />
      </div>
    </form>
  )
}

export default Controls;
