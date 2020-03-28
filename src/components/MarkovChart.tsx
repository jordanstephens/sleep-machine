import React, { useState, useEffect, useCallback } from 'react';
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
  const [hovered, setHovered] = useState<G.Vertex | null>(null);
  const [selected, setSelected] = useState<G.Vertex | null>(null);

  const handleVertexClick = useCallback((index: G.Vertex | null) => {
    setSelected((s) => index === s ? null : index);
  }, [])

  function handleVertexMouseEnter(index: G.Vertex) {
    setHovered(index);
  }

  function handleVertexMouseLeave() {
    setHovered(null);
  }

  function handleWeightDrag(event: DragEvent) {
    if (selected == null) return;
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

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!event.target) return;
      const target = event.target as Element;
      if (target.classList.contains('weight-label')) return
      if (selected == null) return;
      handleVertexClick(null);
    };
    window.addEventListener('mousedown', handleDocumentClick);
    return () => window.removeEventListener('mousedown', handleDocumentClick);
  }, [handleVertexClick, selected])

  const focused = selected == null ? hovered : selected

  return (
    <div className="MarkovChart">
      <WeightedGraph
        labels={labels}
        weights={weights[current]}
        className={classnames('active', {
          fade: focused != null
        })}
        onVertexClick={(i) => {
          if (selected) return;
          handleVertexClick(i);
        }}
        onVertexMouseEnter={handleVertexMouseEnter}
        onVertexMouseLeave={handleVertexMouseLeave}
        selected1={current}
        selected2={next}
      />
      {focused != null && (
        <WeightedGraph
          labels={labels}
          weights={editWeights[focused]}
          selected1={focused}
          className="selected"
          onVertexClick={handleVertexClick}
          onVertexMouseEnter={handleVertexMouseEnter}
          onVertexMouseLeave={handleVertexMouseLeave}
          onWeightDrag={handleWeightDrag}
        />
      )}
    </div>
  );
}

export default MarkovChart;
