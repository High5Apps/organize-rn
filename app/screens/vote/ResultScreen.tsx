import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { ResultScreenProps } from '../../navigation';

export default function ResultScreen({ route }: ResultScreenProps) {
  const { params: { ballotId } } = route;

  return <PlaceholderScreen name={ballotId} />;
}
