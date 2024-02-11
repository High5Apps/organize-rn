import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { NewElectionBallotScreenProps } from '../../navigation';

export default function NewElectionBallotScreen({
  route,
}: NewElectionBallotScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
