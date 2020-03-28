import React, { useEffect, useState } from 'react';
import './SleepMachine.css'
import ProgressMeter from './ProgressMeter';
import PlayPauseButton from './PlayPauseButton';
import MarkovChart from './MarkovChart';
import Controls from './Controls';
import Machine from '../lib/machine'
import NumberInput from './NumberInput';

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

function useMachine(machine: Machine): [number, number, number | undefined, boolean, boolean, (playing: boolean) => void] {
  const [started, setStarted] = useState<boolean>(false);
  const [playing, _setPlaying] = useState<boolean>(false);
  const [beat, setBeat] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [next, setNext] = useState<number | undefined>(undefined);

  function setPlaying(value: boolean) {
    setStarted(true);
    _setPlaying(value);
  }

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

  return [beat, current, next, started, playing, setPlaying]
}

const KEYCODE = {
  SPACEBAR: 32
};

const SleepMachine: React.FC<IProps> = () => {
  const [beat, current, next, started, playing, setPlaying] = useMachine(machine)

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
    <div className="SleepMachine-container">
      <header className="SleepMachine-header">
        <h1 className="wordmark">
          <span>Zzz Machine</span><br />
          <small><em>by <a href="https://twitter.com/jordanstpehens">@jordanstephens</a></em></small>
        </h1>
        <div className="transport-controls-container">
          <div className="transport-controls">
            <div className="ProgressMeter-container">
              {playing && (
                <ProgressMeter beat={beat} />
              )}
            </div>
            <NumberInput
              id="tempo"
              name="tempo"
              min={60}
              max={180}
              step={1}
              value={Math.round(machine.params.tempo)}
              onChange={(tempo) => machine.updateParams({ tempo })}
              className="tempo-input"
            />
            <small>bpm</small>
          </div>
        </div>
      </header>
      <main className="App-main">
        {!started && (
          <div className="overlay">
            <div className="start-message" onClick={handlePlayPause}>
              <div style={{ marginBottom: '1rem', height: '3.5rem', width: '3.5rem' }}>
                <PlayPauseButton playing={false} onClick={() => { }} />
              </div>
              Play
            </div>
          </div>
        )}
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
          </div>
          <div className="Controls-container">
            <Controls
              beat={beat}
              params={machine.params}
              onChange={machine.updateParams}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default SleepMachine;
