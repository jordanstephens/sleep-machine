import React from 'react';
import MarkovChart from '../components/MarkovChart';

export default {
  title: 'MarkovChart',
  component: MarkovChart,
};

const weights = [
  [0, 3, 0, 1, 2],
  [1, 0, 1, 1, 1],
  [1, 0, 0, 2, 1],
  [1, 2, 1, 0, 1],
  [0, 1, 2, 3, 0],
]

export const Five = () => (
  <MarkovChart weights={weights} active={1} />
);
