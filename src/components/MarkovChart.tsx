import React, { useState } from 'react';
import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep'
import WeightedGraph from './WeightedGraph';
import { DragEvent } from './Draggable';
import * as G from '../lib/graph';

interface IMarkovChartProps {
  weights: G.Matrix;
  current: G.Vertex;
  next?: G.Vertex;
  labels: string[];
  onChange: (weights: G.Matrix) => void;
}

function RangeMeter(dmax: number) {
  return (v0: number, distance: number) => {
    const vmax = 1;
    const vmin = 0;
    dmax = Math.max(dmax, Math.abs(distance));

    const p = distance / dmax;
    const vspan = distance >= 0
      ? vmax - v0
      : v0 - vmin

    return v0 + (p * vspan);
  }
}

const MarkovChart: React.FC<IMarkovChartProps> = ({
  current = 0,
  next,
  weights,
  labels,
  onChange
}) => {
  const meter = RangeMeter(200);
  const normalizedWeights = weights.map(G.normalize_proportions);
  const [editWeights, setEditWeights] = useState<G.Matrix>(cloneDeep(normalizedWeights));
  const [selected, setSelected] = useState<G.Vertex | null>(null);

  function handleVertexClick(index: G.Vertex | null) {
    setSelected(index === selected ? null : index);
  }

  function handleWeightDrag(event: DragEvent) {
    if (!selected) return;
    const index = parseInt(event.id, 10);
    const values_0 = [...weights[selected]];
    const v0 = values_0[index];
    const { y } = event.delta;
    const v1 = meter(v0, -1 * y);
    const delta = v1 - v0;
    try {
      const values_1 = G.redistribute(values_0, index, delta);
      editWeights[selected] = values_1;
      setEditWeights([...editWeights]);
    } catch (error) {
      console.error(error);
    }
    if (event.committed) {
      onChange([...editWeights])
    }
  }

  return (
    <div className="MarkovChart">
      <WeightedGraph
        labels={labels}
        weights={weights[current]}
        className={classnames('active', {
          fade: selected != null
        })}
        onVertexClick={(i) => {
          if (selected) return;
          handleVertexClick(i);
        }}
        selected1={current}
        selected2={next}
      />
      {selected != null && (
        <WeightedGraph
          labels={labels}
          weights={editWeights[selected]}
          selected1={selected}
          className="selected"
          onVertexClick={handleVertexClick}
          onWeightDrag={handleWeightDrag}
        />
      )}
    </div>
  );
}

export default MarkovChart;
