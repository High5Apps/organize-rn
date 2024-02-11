import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { OfficeTypeScreenProps } from '../../navigation';

export default function OfficeTypeScreen({
  route,
}: OfficeTypeScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
