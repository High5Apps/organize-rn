import React from 'react';
import type { SettingsScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function SettingsScreen({ route }: SettingsScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
