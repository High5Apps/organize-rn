import React from 'react';
import type { VoteScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function VoteScreen({ route }: VoteScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
