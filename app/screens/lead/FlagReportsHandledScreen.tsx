import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { FlagReportsHandledScreenProps } from '../../navigation';

export default function FlagReportsHandledScreen({
  route,
}: FlagReportsHandledScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
