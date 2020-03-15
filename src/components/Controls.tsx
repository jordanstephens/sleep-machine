import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
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
            value={params.waveform}
            onChange={(waveform) => onChange({ waveform: waveform as Waveform })}
            options={WAVEFORM_OPTIONS}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="delay">
          Delay Time
        </label>
        <div className="form-row">
          <RadioButtons
            name="delay_time"
            value={params.delay_time}
            onChange={(delay_time) => onChange({ delay_time: delay_time as DelayTime })}
            options={DELAY_TIME_OPTIONS}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="delay">
          Feedback
        </label>
        <div className="form-row">
          <InputRange
            name="delay_feedback"
            value={params.delay_feedback}
            minValue={0.0}
            maxValue={1.0}
            step={0.01}
            onChange={(delay_feedback) => onChange({ delay_feedback: delay_feedback as number })}
            formatLabel={(value) => String(Math.round(value * 100.0))}
          />
        </div>
      </fieldset>
    </form>
  )
}

export default Controls;
