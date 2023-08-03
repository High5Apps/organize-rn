import React from 'react';
import type { NewPostScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function NewPostScreen({ route }: NewPostScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
