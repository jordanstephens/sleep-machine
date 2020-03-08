import React, { useEffect, useState } from 'react';
import './SleepMachine.css'
import MarkovChart from './MarkovChart';
import Controls from './Controls';
import Machine, { Params } from '../lib/machine'

const LABELS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const INITIAL_WEIGHTS = [
  [0.00, 0.09, 0.06, 0.30, 0.40, 0.15, 0],
  [0.18, 0.00, 0.13, 0.22, 0.22, 0.25, 0],
  [0.06, 0.10, 0.00, 0.41, 0.10, 0.33, 0],
  [0.38, 0.06, 0.04, 0.00, 0.38, 0.14, 0],
  [0.27, 0.07, 0.05, 0.27, 0.00, 0.34, 0],
  [0.16, 0.09, 0.09, 0.36, 0.30, 0.00, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

const machine = new Machine(INITIAL_WEIGHTS);

interface ISleepMachineProps {

}

const SleepMachine: React.FC<ISleepMachineProps> = () => {
  const [progress, setProgress] = useState<number>(0.0);
  const [current, setCurrent] = useState<number>(0);
  const [next, setNext] = useState<number | undefined>(undefined);
  const [weights, setWeights] = useState<number[][]>(INITIAL_WEIGHTS);

  useEffect(() => {
    machine.on('select', (next, current) => {
      setNext(next);
    }).on('change', (pattern, active) => {
      setNext(undefined);
      setCurrent(active);
    }).on('progress', (progress) => {
      setProgress(progress)
    }).start();

    return () => machine.stop();
  }, [])

  function handleWeightsChange(weights: number[][]) {
    setWeights(weights);
  }

  return (
    <div className="SleepMachine">
      <div className="MarkovChart-container">
        <MarkovChart
          labels={LABELS}
          current={current}
          next={next}
          weights={weights}
          onChange={handleWeightsChange}
        />
      </div>
      <div className="Controls-container">
        <Controls
          params={machine.params}
          onChange={machine.updateParams}
        />
      </div>
    </div>
  );
}

export default SleepMachine;
