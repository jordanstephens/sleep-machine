import React from 'react';
import classnames from 'classnames'
import './WeightedGraph.css';
import {
  SIZE,
  NOOP,
  IConfig,
  generateConfig
} from './util';
import * as G from '../../lib/graph';
import Edge from './Edge';
import Point from './Point';

const GRAPH_RADIUS = 33.33333;
const POINT_RADIUS = 5;
const DEFAULT_CONFIG = generateConfig(POINT_RADIUS, GRAPH_RADIUS);

interface IProps {
  labels?: string[];
  weights: G.Vector;
  selected?: number;
  onVertexClick?: (i: G.Vertex | null, event: React.MouseEvent) => void;
  className?: string;
  config?: IConfig
}

const WeightedGraph: React.FC<IProps> = ({
  labels = [],
  weights = [],
  onVertexClick = NOOP,
  className,
  selected,
  config: _config
}) => {
  const config = { ..._config, ...DEFAULT_CONFIG };
  const graph = new G.Graph(weights);
  const points = graph.chart(config.graph_radius);
  const active_weights = graph.normalized_weights;
  return (
    <div className={classnames('WeightedGraph', className)}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g style={{
          transform: 'scale(1)',
          transformOrigin: '50% 50%'
        }}>
          {graph.edges.map(({ a, b }) => {
            const [p1, p2] = selected === a
              ? [a, b]
              : selected === b
                ? [b, a]
                : []
            if (p1 == null || p2 == null) return null;
            const weight = selected == null ? 0 : weights[p2]
            if (weight === 0) return null;
            return (
              <Edge
                key={`${p1}:${p2}`}
                p1={points[p1]}
                p2={points[p2]}
                weight={weight}
              />
            )
          })}
          {points.map((point, i) => (
            <Point
              point={point}
              weight={active_weights[i]}
              label={labels[i] || String(i)}
              onClick={(event: React.MouseEvent) => onVertexClick(i, event)}
              className={classnames({
                selected: selected === i
              })}
              config={config}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default WeightedGraph;
