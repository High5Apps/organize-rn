import React from 'react';
import type { BallotsScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function BallotsScreen({ route }: BallotsScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
