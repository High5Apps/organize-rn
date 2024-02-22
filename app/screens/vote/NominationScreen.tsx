import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { NominationScreenProps } from '../../navigation';

export default function NominationScreen({
  route,
}: NominationScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
