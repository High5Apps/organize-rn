import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { PermissionScreenProps } from '../../navigation';

export default function PermissionScreen({ route }: PermissionScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
