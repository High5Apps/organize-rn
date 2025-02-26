import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { UnionCardsScreenProps } from '../../navigation';

export default function UnionCardsScreen({ route }: UnionCardsScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
