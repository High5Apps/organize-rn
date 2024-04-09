import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { PermissionsScreenProps } from '../../navigation';

export default function PermissionsScreen({ route }: PermissionsScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
