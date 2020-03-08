import React from 'react';
import { Params } from '../lib/machine'

interface IControlsProps {
  params: Params;
  onChange: () => void;
}

const Controls: React.FC<IControlsProps> = ({ params, onChange }) => {
  return (
    <form className="Controls">
      <strong>Controls</strong>
    </form>
  )
}

export default Controls;
