import React from 'react';
import { VoteScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function VoteScreen({ route }: VoteScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
