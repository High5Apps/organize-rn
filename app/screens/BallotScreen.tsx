import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import type { BallotScreenProps } from '../navigation';

export default function BallotScreen({ route }: BallotScreenProps) {
  const { name, params: { ballotId } } = route;
  console.log({ ballotId });
  return <PlaceholderScreen name={name} />;
}
