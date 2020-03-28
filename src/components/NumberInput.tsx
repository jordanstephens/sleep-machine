import React, { useState, ChangeEvent, HTMLProps } from 'react';
import throttle from 'lodash/throttle';

const KEY = {
  UP: 38,
  DOWN: 40,
}

type InputProps = Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value'>;
interface IProps extends InputProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const NumberInput: React.FC<IProps> = ({ min, max, step, value, onChange, ...props }) => {
  const valid = (value: number) => !isNaN(value) && min <= value && value <= max
  if (!valid(value)) throw new Error(`invalid value "${value}"`);
  const updateValue = throttle(onChange);
  const [localValue, setLocalValue] = useState<number>(value);


  function commitChange(_value: number) {
    if (valid(_value)) {
      setLocalValue(_value);
      updateValue(_value);
    } else {
      setLocalValue(value);
    }
  }

  function handleInputChange(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    setLocalValue(Number(target.value));
  }

  function handleBlur(event: React.SyntheticEvent) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    commitChange(value);
  }

  const increment = () => {
    const value = localValue + step;
    if (!valid(value)) return;
    commitChange(value)
  }

  const decrement = () => {
    const value = localValue - step;
    if (!valid(value)) return;
    commitChange(value)
  }

  const keyHandlers = {
    [KEY.DOWN]: decrement,
    [KEY.UP]: increment
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const fn = keyHandlers[event.keyCode];
    if (!fn) return;
    fn();
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      onBlur={handleBlur}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      value={localValue}
    />
  )
}

export default NumberInput
