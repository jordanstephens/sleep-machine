import React from 'react';
import Slider from './Slider';
import { Params, PartialParams, Waveform, DelayTime } from '../lib/machine'
import Square from './icons/Square';
import Circle from './icons/Circle';
import Triangle from './icons/Triangle';
import Sawtooth from './icons/Sawtooth';
import RadioButtons from './RadioButtons';

const BG_COLOR = 'hsla(0, 0%, 0%, 0.4)'
const FG_COLOR = 'grey'

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
  { value: '4t', label: '4t' },
  { value: '4n', label: '4' },
  { value: '8t', label: '8t' },
  { value: '8n', label: '8' }
]

interface IControlsProps {
  beat: number;
  params: Params;
  onChange: (params: PartialParams) => void;
}

const Controls: React.FC<IControlsProps> = ({ params, onChange }) => {
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
      <fieldset className="form-col envelope">
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
                styles={{
                  active: {
                    background: FG_COLOR
                  },
                  track: {
                    background: BG_COLOR,
                    cursor: 'move-y',
                    height: '200px'
                  }
                }}
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
                styles={{
                  active: {
                    background: FG_COLOR
                  },
                  track: {
                    background: BG_COLOR,
                    cursor: 'move-y',
                    height: '200px'
                  }
                }}
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
                styles={{
                  active: {
                    background: FG_COLOR
                  },
                  track: {
                    background: BG_COLOR,
                    cursor: 'move-y',
                    height: '200px'
                  }
                }}
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
                styles={{
                  active: {
                    background: FG_COLOR
                  },
                  track: {
                    background: BG_COLOR,
                    cursor: 'move-y',
                    height: '200px'
                  }
                }}
              />
              <label className="fader-label">R</label>
            </div>
            <div className="fader-container">
              <Slider
                axis="y"
                y={params.width}
                ymin={0.1}
                ymax={1.0}
                ystep={0.1}
                onChange={({ y }) => onChange({ width: y })}
                styles={{
                  active: {
                    background: FG_COLOR,
                  },
                  track: {
                    background: BG_COLOR,
                    cursor: 'move-y',
                    height: '200px'
                  }
                }}
              />
              <label className="fader-label">W</label>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="form-col delay">
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
                background: BG_COLOR,
                borderRadius: '4px',
                cursor: 'move',
                width: '220px'
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
      <fieldset className="form-col chorus">
        <label className="form-row" htmlFor="chorus_frequency">
          Chorus
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
                background: BG_COLOR,
                borderRadius: '4px',
                cursor: 'move',
                width: '220px'
              }
            }}
          />
        </div>
      </fieldset>
    </form>
  )
}

export default Controls;
