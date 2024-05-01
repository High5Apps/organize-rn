import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { FlaggedHandledScreenProps } from '../../navigation';

export default function FlaggedHandledScreen({
  route,
}: FlaggedHandledScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
