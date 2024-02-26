import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { NewNominationScreenProps } from '../../navigation';

export default function NewNominationScreen({
  route,
}: NewNominationScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
