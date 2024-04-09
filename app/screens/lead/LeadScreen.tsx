import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { LeadScreenProps } from '../../navigation';

export default function LeadScreen({ route }: LeadScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
