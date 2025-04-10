import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { EditWorkGroupScreenProps } from '../../navigation';

export default function EditWorkGroupScreen({
  route,
}: EditWorkGroupScreenProps) {
  const { workGroupId } = route.params;
  return <PlaceholderScreen name={workGroupId} />;
}
