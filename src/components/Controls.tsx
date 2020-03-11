import React from 'react';
import { Params, PartialParams, Waveform, DelayTime } from '../lib/machine'
import ProgressMeter from './ProgressMeter';
import Square from './icons/Square';
import Circle from './icons/Circle';
import Triangle from './icons/Triangle';
import Sawtooth from './icons/Sawtooth';
import RadioButtons from './RadioButtons';

const WAVEFORM_OPTIONS = [
  {
    value: 'sine',
    title: 'Sine',
    label: <Circle className="waveform-icon" />
  },
  {
    value: 'square',
    title: 'Square',
    label: <Square className="waveform-icon" />
  },
  {
    value: 'triangle',
    title: 'Triangle',
    label: <Triangle className="waveform-icon" />
  },
  {
    value: 'sawtooth',
    title: 'Sawtooth',
    label: <Sawtooth className="waveform-icon" />
  }
]

const DELAY_TIME_OPTIONS = [
  { value: '1m', label: '1' },
  { value: '2n', label: '2' },
  { value: '4n', label: '4' },
  { value: '4t', label: '4t' },
  { value: '8n', label: '8' },
  { value: '8t', label: '8t' }
]

interface IControlsProps {
  beat: number;
  params: Params;
  onChange: (params: PartialParams) => void;
}

const Controls: React.FC<IControlsProps> = ({ beat, params, onChange }) => {
  return (
    <form className="Controls">
      <fieldset className="form-col">
        <label className="form-row" htmlFor="tempo">
          Tempo
        </label>
        <div className="form-row">
          <div className="ProgressMeter-container">
            <ProgressMeter beat={beat} />
          </div>
          <input
            type="number"
            id="tempo"
            name="tempo"
            value={params.tempo}
            onChange={(event) => onChange({
              tempo: parseInt(event.target.value, 10)
            })}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="waveform">
          Waveform
        </label>
        <div className="form-row">
          <RadioButtons
            name="waveform"
            value={params.waveform || 'sine'}
            onChange={(waveform) => onChange({ waveform: waveform as Waveform })}
            options={WAVEFORM_OPTIONS}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="delay">
          Delay
        </label>
        <div className="form-row">
          <RadioButtons
            name="delay_time"
            value={params.delay_time || '4n'}
            onChange={(delay_time) => onChange({ delay_time: delay_time as DelayTime })}
            options={DELAY_TIME_OPTIONS}
          />
        </div>
      </fieldset>
    </form>
  )
}

export default Controls;
