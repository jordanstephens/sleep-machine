
import React from 'react';
import * as G from '../../lib/graph';
import { IConfig } from './util'
import Node from './Node';
import Label from './Label';

interface IPointProps {
  point: G.Point;
  weight: number;
  label?: string;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  config: IConfig;
}

const Point: React.FC<IPointProps> = ({ point, config, weight, label, className, onClick }) => (
  <g onClick={onClick}>
    <Label
      text={label || ""}
      point={point}
      offset={config.label_offset}
      size={config.label_size}
    />

    <Node
      point={point}
      radius={config.point_radius}
      weight={1}
      className="click-target"
    />

    <Node
      point={point}
      radius={config.point_radius}
      weight={weight}
      className={className}
    />
  </g>
);

export default Point;
