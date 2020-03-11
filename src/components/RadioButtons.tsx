import React from 'react';

interface RadioOption {
  value: string;
  title?: string;
  label: React.ReactNode;
}

interface IProps {
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
}

const RadioButtons: React.FC<IProps> = ({ name, value, options, onChange }) => (
  <div className="RadioButtons">
    {options.map(({ label, title, value: _value }) => (
      <div className="RadioButton" key={_value}>
        <input
          type="radio"
          name="waveform"
          id={_value}
          value={_value}
          onChange={() => onChange(_value)}
          checked={_value === value}
        />
        <label htmlFor={_value} title={title}>
          {label}
        </label>
      </div>
    ))}
  </div>
)

export default RadioButtons;
