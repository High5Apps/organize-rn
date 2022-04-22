import React from 'react';
import { DiscussScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function DiscussScreen({ route }: DiscussScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
