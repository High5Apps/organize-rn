import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { ModerationScreenProps } from '../../navigation';

export default function ModerationScreen({ route }: ModerationScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
