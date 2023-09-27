import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import type { NewReplyScreenProps } from '../navigation';

export default function NewReplyScreen({ route }: NewReplyScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
