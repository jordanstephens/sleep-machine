import React from 'react';
import classnames from 'classnames'
import './WeightedGraph.css';
import {
  SIZE,
  POINT_RADIUS,
  NOOP,
  IConfig,
  generateConfig
} from './util';
import * as G from '../../lib/graph';
import Edge from './Edge';
import Point from './Point';
import { DraggableProvider, DragEvent } from '../Draggable';

const GRAPH_RADIUS = 33.33333;
const DEFAULT_CONFIG = generateConfig(POINT_RADIUS, GRAPH_RADIUS);

interface IProps {
  labels?: string[];
  weights: G.Vector;
  selected1?: number;
  selected2?: number;
  onWeightDrag?: (event: DragEvent) => void;
  onVertexClick?: (i: G.Vertex | null, event: React.MouseEvent) => void;
  onVertexMouseEnter?: (i: G.Vertex, event: React.MouseEvent) => void;
  onVertexMouseLeave?: (i: G.Vertex, event: React.MouseEvent) => void;
  className?: string;
  config?: IConfig
}

const WeightedGraph: React.FC<IProps> = ({
  labels = [],
  weights = [],
  onVertexMouseEnter = NOOP,
  onVertexMouseLeave = NOOP,
  onVertexClick = NOOP,
  onWeightDrag,
  className,
  selected1,
  selected2,
  config: _config
}) => {
  const config = { ..._config, ...DEFAULT_CONFIG };
  const graph = new G.Graph(weights);
  const points = graph.chart(config.graph_radius);
  const active_weights = graph.normalized_weights;
  return (
    <div className={classnames('WeightedGraph', className)}>
      <DraggableProvider onDrag={onWeightDrag}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse"
              className="edge-arrow"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker id="selected-arrow" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse"
              className="edge-arrow selected"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <g style={{
            transform: 'scale(1)',
            transformOrigin: '50% 50%'
          }}>
            {graph.edges.map(({ a, b }) => {
              const [p1, p2] = selected1 === a
                ? [a, b]
                : selected1 === b
                  ? [b, a]
                  : []
              if (p1 == null || p2 == null) return null;
              const weight = selected1 == null ? 0 : weights[p2]
              if (weight === 0) return null;
              return (
                <Edge
                  key={`${p1}:${p2}`}
                  id={String(p2)}
                  p1={points[p1]}
                  p2={points[p2]}
                  weight={onWeightDrag && weight}
                  selected={selected1 === p1 && selected2 === p2}
                />
              )
            })}
            {points.map((point, i) => (
              <Point
                key={i}
                point={point}
                weight={selected1 === i ? 1 : active_weights[i]}
                label={labels[i] || String(i)}
                onClick={(event) => onVertexClick(i, event)}
                onMouseEnter={(event) => onVertexMouseEnter(i, event)}
                onMouseLeave={(event) => onVertexMouseLeave(i, event)}
                className={classnames({
                  selected1: selected1 === i,
                  selected2: selected2 === i
                })}
                config={config}
              />
            ))}
          </g>
        </svg>
      </DraggableProvider>
    </div>
  );
};

export default WeightedGraph;
