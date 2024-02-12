import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { OfficeDutiesScreenProps } from '../../navigation';

export default function OfficeDutiesScreen({
  route,
}: OfficeDutiesScreenProps) {
  const { officeCategory } = route.params;
  return <PlaceholderScreen name={officeCategory} />;
}
