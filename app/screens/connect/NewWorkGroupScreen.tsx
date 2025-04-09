import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { NewWorkGroupScreenProps } from '../../navigation';

export default function NewWorkGroupScreen({ route }: NewWorkGroupScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
