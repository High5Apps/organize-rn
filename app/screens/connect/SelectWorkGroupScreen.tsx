import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { SelectWorkGroupScreenProps } from '../../navigation';

export default function SelectWorkGroupScreen({
  route,
}: SelectWorkGroupScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
