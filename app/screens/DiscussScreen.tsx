import React from 'react';
import type { DiscussScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function DiscussScreen({ route }: DiscussScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
