import React from 'react';
import { Params } from '../lib/machine'

interface IControlsProps {
  params: Params;
  onChange: (params: Params) => void;
}

const Controls: React.FC<IControlsProps> = ({ params, onChange }) => {
  return (
    <form className="Controls">
      <strong>Controls</strong>
      <input
        type="number"
        name="tempo"
        value={params.tempo}
        onChange={(event) => onChange({
          tempo: parseInt(event.target.value, 10)
        })}
      />
    </form>
  )
}

export default Controls;
