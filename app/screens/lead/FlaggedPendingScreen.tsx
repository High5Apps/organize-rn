import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { FlaggedPendingScreenProps } from '../../navigation';

export default function FlaggedPendingScreen({
  route,
}: FlaggedPendingScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
