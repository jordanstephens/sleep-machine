import React, { useEffect, useState } from 'react';
import './SleepMachine.css'
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

const SleepMachine: React.FC<IProps> = () => {
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

  function handleWeightsChange(weights: number[][]) {
    machine.updateProbabilities(weights);
  }

  function handlePlayPause() {
    const machineState = machine.state === 'started'
    setPlaying(!machineState)
    machine.toggle();
  }

  return (
    <div className="SleepMachine">
      <div className="MarkovChart-container">
        <MarkovChart
          labels={LABELS}
          current={current}
          next={next}
          weights={machine.probabilities}
          onChange={handleWeightsChange}
        />
        <div className="PlayButton-container">
          <PlayPauseButton playing={playing} onClick={handlePlayPause} />
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
