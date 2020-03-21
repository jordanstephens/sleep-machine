import React from 'react';
import Slider from './Slider';
import { Params, PartialParams, Waveform, DelayTime } from '../lib/machine'
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
      <fieldset className="form-col waveform">
        <label className="form-row" htmlFor="waveform">
          Waveform
        </label>
        <div className="form-row">
          <RadioButtons
            name="waveform"
            value={params.waveform}
            onChange={(value) => onChange({ waveform: value as Waveform })}
            options={WAVEFORM_OPTIONS}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="envelope">
          Envelope
        </label>
        <div className="form-row">
          <div className="fader-bank">
            <div className="fader-container">
              <Slider
                axis="y"
                y={params.attack}
                ymin={0.01}
                ymax={1.0}
                ystep={0.01}
                onChange={({ y }) => onChange({ attack: y })}
              />
              <label className="fader-label">A</label>
            </div>
            <div className="fader-container">
              <Slider
                axis="y"
                y={params.decay}
                ymin={0.01}
                ymax={1.0}
                ystep={0.01}
                onChange={({ y }) => onChange({ decay: y })}
              />
              <label className="fader-label">D</label>
            </div>
            <div className="fader-container">
              <Slider
                axis="y"
                y={params.sustain}
                ymin={0.01}
                ymax={1.0}
                ystep={0.01}
                onChange={({ y }) => onChange({ sustain: y })}
              />
              <label className="fader-label">S</label>
            </div>
            <div className="fader-container">
              <Slider
                axis="y"
                y={params.release}
                ymin={0.01}
                ymax={1.0}
                ystep={0.01}
                onChange={({ y }) => onChange({ release: y })}
              />
              <label className="fader-label">R</label>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="delay_wet">
          Delay
        </label>
        <div className="form-row">
          <Slider
            axis="xy"
            x={params.delay_feedback}
            xmin={0.0}
            xmax={1.0}
            xstep={0.01}
            y={params.delay_wet}
            ymin={0.0}
            ymax={1.0}
            ystep={0.01}
            onChange={({ x, y }) => onChange({
              delay_feedback: x,
              delay_wet: y
            })}
            styles={{
              track: {
                cursor: 'move',
                width: '100%'
              }
            }}
          />
        </div>
      </fieldset>
      <fieldset className="form-col delay-time">
        <label className="form-row" htmlFor="delay_time">
          Delay Time
        </label>
        <div className="form-row">
          <RadioButtons
            name="delay_time"
            value={params.delay_time}
            onChange={(value) => onChange({ delay_time: value as DelayTime })}
            options={DELAY_TIME_OPTIONS}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="chorus_frequency">
          Chorus Frequency
        </label>
        <div className="form-row">
          <Slider
            axis="xy"
            x={params.chorus_frequency}
            xmin={0.0}
            xmax={20.0}
            xstep={0.1}
            y={params.chorus_depth}
            ymin={0.0}
            ymax={1.0}
            ystep={0.01}
            onChange={({ x, y }) => onChange({
              chorus_frequency: x,
              chorus_depth: y
            })}
            styles={{
              track: {
                cursor: 'move',
                width: '100%'
              }
            }}
          />
        </div>
      </fieldset>
      <fieldset className="form-col">
        <label className="form-row" htmlFor="width">
          Pulse Width
        </label>
        <div className="form-row">
          <Slider
            x={params.width}
            xmin={0.0}
            xmax={1.0}
            xstep={0.1}
            onChange={({ x }) => onChange({ width: x })}
            styles={{
              track: {
                cursor: 'move',
                width: '100%'
              }
            }}
          />
        </div>
      </fieldset>
    </form>
  )
}

export default Controls;
