import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { UnionCardScreenProps } from '../../navigation';

export default function UnionCardScreen({ route }: UnionCardScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
