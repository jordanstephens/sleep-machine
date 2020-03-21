import React, { useState } from 'react';
import ReactInputSlider, { InputSliderProps } from 'react-input-slider';

interface IValues {
  x?: number;
  y?: number;
}

interface IProps extends InputSliderProps {
  onChange: (values: IValues) => void;
}

const Slider: React.FC<IProps> = ({ x, y, onChange, ...props }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [values, setValues] = useState<IValues>({ x, y });

  function handleChange(values: IValues) {
    setValues(values);
    onChange(values);
  }

  dragging && console.log(values, { x, y })

  return (
    <ReactInputSlider
      {...props}
      x={dragging && values.x ? values.x : x}
      y={dragging && values.y ? values.y : y}
      onChange={handleChange}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
    />
  )
}

export default Slider
