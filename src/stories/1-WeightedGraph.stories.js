import React from 'react';
import WeightedGraph from '../components/WeightedGraph';

export default {
  title: 'WeightedGraph',
  component: WeightedGraph,
};

export const One = () => (
  <WeightedGraph weights={[1]} />
);

export const Two = () => (
  <WeightedGraph weights={[1, 1]} />
);

export const Three = () => (
  <WeightedGraph weights={[1, 1, 1]} />
);

export const Five = () => (
  <WeightedGraph weights={[1, 1, 1, 1, 1]} />
);

export const Seven = () => (
  <WeightedGraph weights={[1, 1, 1, 1, 1, 1, 1]} />
);

export const Inequal = () => (
  <WeightedGraph weights={[1, 2, 3]} />
);

export const Incomplete = () => (
  <WeightedGraph weights={[1, 0, 3]} />
);
