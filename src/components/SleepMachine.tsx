import React, { useEffect, useState } from 'react';
import './SleepMachine.css'
import ProgressMeter from './ProgressMeter';
import PlayPauseButton from './PlayPauseButton';
import MarkovChart from './MarkovChart';
import Controls from './Controls';
import Machine from '../lib/machine'

const LABELS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const INITIAL_WEIGHTS = [
  [0.00, 0.09, 0.06, 0.30, 0.40, 0.15, 0],
  [0.18, 0.00, 0.13, 0.22, 0.22, 0.25, 0],
  [0.06, 0.10, 0.00, 0.41, 0.10, 0.33, 0],
  [0.38, 0.06, 0.04, 0.00, 0.38, 0.14, 0],
  [0.27, 0.07, 0.05, 0.27, 0.00, 0.34, 0],
  [0.16, 0.09, 0.09, 0.36, 0.30, 0.00, 0],
  [0.16, 0.16, 0.16, 0.16, 0.16, 0.16, 0]
];

const machine = new Machine(INITIAL_WEIGHTS);

interface IProps { }

function useMachine(machine: Machine): [number, number, number | undefined, boolean, (playing: boolean) => void] {
  const [playing, setPlaying] = useState<boolean>(false);
  const [beat, setBeat] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [next, setNext] = useState<number | undefined>(undefined);

  useEffect(() => {
    machine.on('select', (next, current) => {
      setNext(next);
    }).on('change', (pattern, active) => {
      setNext(undefined);
      setCurrent(active);
    }).on('beat', (beat) => {
      setBeat(beat)
    });

    return () => machine.stop();
  }, [])

  return [beat, current, next, playing, setPlaying]
}

const KEYCODE = {
  SPACEBAR: 32
};

const SleepMachine: React.FC<IProps> = () => {
  const [beat, current, next, playing, setPlaying] = useMachine(machine)

  function handlePlayPause() {
    const machineState = machine.state === 'started'
    setPlaying(!machineState)
    machine.toggle();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // TODO: on my machine, spacebar will toggle a focused button element.
      // this means that if the PlayPauseButton is focused then spacebar
      // keypresses will toggle the machine state twice. as a work around.
      // we can ignore spacebar keypresses if the activeElement is the
      // PlayPauseButton. it might be safer to use a throttle or debounce
      // here instead
      if (document.activeElement?.classList.contains('PlayPauseButton')) return
      if (event.keyCode === KEYCODE.SPACEBAR) return handlePlayPause();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleWeightsChange(weights: number[][]) {
    machine.updateProbabilities(weights);
  }

  return (
    <div className="SleepMachine">
      <div className="viz-container">
        <div className="MarkovChart-container">
          <MarkovChart
            labels={LABELS}
            current={current}
            next={next}
            weights={machine.probabilities}
            onChange={handleWeightsChange}
          />
        </div>
        <div className="transport-controls-container">
          <div className="transport-controls">
            <PlayPauseButton playing={playing} onClick={handlePlayPause} />
            <div className="ProgressMeter-container">
              <ProgressMeter beat={beat} />
            </div>
            <input
              type="number"
              id="tempo"
              name="tempo"
              value={machine.params.tempo}
              onChange={(event) => machine.updateParams({
                tempo: parseInt(event.target.value, 10)
              })}
              style={{ width: '8ch' }}
            />
          </div>
        </div>
      </div>
      <div className="Controls-container">
        <Controls
          beat={beat}
          params={machine.params}
          onChange={machine.updateParams}
        />
      </div>
    </div>
  );
}

export default SleepMachine;
